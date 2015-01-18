import unittest
import urllib2, urlparse
from StringIO import StringIO
import json

import webapp2
from markupsafe import Markup, escape
import webtest

from google.appengine.api import mail
from google.appengine.ext import testbed

import server.lib.formValidation as formValidation
from server.controllers.contact import ContactHandler
from server.controllers.html import ContentHandler

class testContactHandler(unittest.TestCase):
	def setUp(self):
		# logging.warning(sys.path)
		app = webapp2.WSGIApplication([
    		webapp2.Route('/contact', handler='server.controllers.contact.ContactHandler', name='contact-form'),
    		webapp2.Route('/contact/sent', handler='server.controllers.html.ContentHandler', name='contact-sent'),
    		webapp2.Route('/contact/not-human', handler='server.controllers.html.ContentHandler', name='contact-nothuman'),
    		webapp2.Route('/contact/misconfigured', handler='server.controllers.html.ContentHandler', name='contact-misconfig')
		])

		self.testApp = webtest.TestApp(app)
		self.testbed = testbed.Testbed()
		self.testbed.activate()
		self.testbed.init_mail_stub()

		self.testbed.init_urlfetch_stub()
		self.mail_stub = self.testbed.get_stub(testbed.MAIL_SERVICE_NAME)

		self.goodPost = {
			'email': 'alex@gmail.com', 
			'g-recaptcha-response': 'value-of-g-recaptcha-response',
			'message': 'A message',
			'name': 'Alex Bransby-Williams'
			}

		self.recaptchaSecret = '6LdT9_4SAAAAAKvBtC9hi-nf7kaoQeGDIdMcXxXi'

	def teardown(self):
		self.testbed.deactivate()

	def testGet(self):
		response = self.testApp.get('/contact')
		# webtest checks that the response code is 2xx or 3xx
		# self.assertEqual(response.status_int, 200)
		self.assertEqual(response.content_type, 'text/html')

	def testBadPost(self):
		badParams = formValidation.combineRequiredFields(self.goodPost)

		for params in badParams:
			response = self.testApp.post('/contact', params, status=400)

	def testInvalidEmail(self):
		args = self.goodPost
		args['email'] = 'bad email'

		response = self.testApp.post('/contact', args) 
		form = response.form

		self.assertEqual('bad email', form['email'].value)
		self.assertEqual(args['name'], form['name'].value)
		self.assertEqual(args['message'], form['message'].value)

		# g-recaptcha-response is inserted via JavaScript
		self.assertTrue('g-recaptcha-response' not in form.fields)

	def testUserInputEscapedWhenFormRedisplayed(self):
		args = {
			'email': '<script type="text/javascript">alert("Script injection");</script>',
			'g-recaptcha-response': '<script type="text/javascript">alert("Script injection");</script>',
			'name': '<script type="text/javascript">alert("Script injection");</script>',
			'message': '<script type="text/javascript">alert("Script injection");</script>'		
		}

		response = self.testApp.post('/contact', args)
		form = response.form

		field = response.html.find(id='inputEmail1')
		
		# If the arg values aren't escaped then the html parser
		# webtest uses (Beautiful Soup) will be unable to recover
		# the values we posted. So, ensuring that the values we get
		# back match the ones we posted means the values are
		# escaped when they're re-displayed
		self.assertEqual(args['email'], form['email'].value)
		self.assertEqual(args['name'], form['name'].value)
		self.assertEqual(args['message'], form['message'].value)

	def testUserInputIsTrimmedWhitespaceWhenFormRedisplayed(self):
		args = {
			'email': ' alexgmail.com ',
			'g-recaptcha-response': self.recaptchaSecret,
			'name': ' Alex ',
			'message': ' This is a message '
		}

		response = self.testApp.post('/contact', args)
		form = response.form

		self.assertEqual('alexgmail.com', form['email'].value)
		self.assertEqual('Alex', form['name'].value)
		self.assertEqual('This is a message', form['message'].value)

	def testGoodPost(self):
		mockHandler = MockHTTPSHandler(mock_good_recaptcha)
		url_opener = urllib2.build_opener(mockHandler)
		urllib2.install_opener(url_opener)

		response = self.testApp.post('/contact', self.goodPost, )

		(recaptchaUrl, recapthaQueryArgs) = mockHandler.full_url.split('?')
		recapthaQueryArgs = urlparse.parse_qs(recapthaQueryArgs)

		self.assertEqual(mockHandler.method, 'GET')
		self.assertEqual(recaptchaUrl, 'https://www.google.com/recaptcha/api/siteverify')
		self.assertEqual(recapthaQueryArgs['secret'][0], self.recaptchaSecret)
		self.assertEqual(recapthaQueryArgs['response'][0], self.goodPost['g-recaptcha-response'])
		
		# request.client_addr appears to be unavailble in GAE live environment
		# self.assertEqual(recapthaQueryArgs['remoteip'][0], '127.0.0.1')
		self.assertEqual(response.status_int, 302)

		response = response.follow()
		self.assertMessageSent(response)

	def testInvalidRecapthaSecret(self):
		mockHandler = MockHTTPSHandler(mock_invalid_recaptcha_secret)
		url_opener = urllib2.build_opener(mockHandler)
		urllib2.install_opener(url_opener)

		response = self.testApp.post('/contact', self.goodPost, extra_environ=dict(REMOTE_ADDR='127.0.0.1'))

		messages = self.mail_stub.get_sent_messages(to='alex.bransbywilliams@gmail.com')
		self.assertEqual(1, len(messages))
		self.assertEqual('alex.bransbywilliams@gmail.com', messages[0].to)
		self.assertEqual('CV: Invalid recaptcha secret', messages[0].subject)
		self.assertEqual('Google Recaptcha says the secret "' + self.recaptchaSecret + '" is invalid. Contact form is broken.', messages[0].body.decode())

		self.assertEqual(response.status_int, 302)

		response = response.follow()
		self.assertEqual('That Could Of Gone Better...', response.html.h1.string)


	def testRecaptchaDown(self):
		mockHandler = MockHTTPSHandler(mock_recaptcha_down)
		url_opener = urllib2.build_opener(mockHandler)
		urllib2.install_opener(url_opener)

		response = self.testApp.post('/contact', self.goodPost)

		# We don't want to penalise users because recaptcha is down
		# so just send the mail and we'll live with any spam received
		# until recaptcha recovers
		self.assertEqual(response.status_int, 302)

		response = response.follow()
		self.assertMessageSent(response)

	def testRecaptchaResponseInvalid(self):
		mockHandler = MockHTTPSHandler(mock_recaptcha_response_invalid)
		url_opener = urllib2.build_opener(mockHandler)
		urllib2.install_opener(url_opener)

		response = self.testApp.post('/contact', self.goodPost, extra_environ=dict(REMOTE_ADDR='127.0.0.1'))

		messages = self.mail_stub.get_sent_messages(to='alex.bransbywilliams@gmail.com')
		self.assertEqual(0, len(messages))
		
		self.assertEqual(response.status_int, 302)

		response = response.follow()
		self.assertEqual('Humans Only', response.html.h1.string)


	def assertMessageSent(self, response):
		messages = self.mail_stub.get_sent_messages(to='alex.bransbywilliams@gmail.com')
		self.assertEqual(1, len(messages))
		self.assertEqual('alex.bransbywilliams@gmail.com', messages[0].to)
		self.assertEqual('CV: Message from Alex Bransby-Williams', messages[0].subject)
		self.assertEqual('A message\n\nSenders Email: alex@gmail.com', messages[0].body.decode())

		self.assertEqual('Message Sent', response.html.h1.string)

def mock_good_recaptcha(req):
	data = { 'success': True, 'error-codes': []}
	resp = urllib2.addinfourl(StringIO(json.dumps(data)), "Content-Type: 'application/json'", req.get_full_url())
	resp.code = 200
	resp.msg = "OK"

	return resp

def mock_invalid_recaptcha_secret(req):
	data = { 'success': False, 'error-codes': ['invalid-input-secret']}
	resp = urllib2.addinfourl(StringIO(json.dumps(data)), "Content-Type: 'application/json'", req.get_full_url())
	resp.code = 200
	resp.msg = "OK"

	return resp

def mock_recaptcha_down(req):
	resp = urllib2.addinfourl(StringIO("Uknown error message"), "Content-Type: 'text/plain'", req.get_full_url())
	resp.code = 500
	resp.msg = "Error"

def mock_recaptcha_response_invalid(req):
	data = { 'success': False, 'error-codes': ['invalid-input-response']}
	resp = urllib2.addinfourl(StringIO(json.dumps(data)), "Content-Type: 'application/json'", req.get_full_url())
	resp.code = 200
	resp.msg = "OK"

	return resp

class MockHTTPSHandler(urllib2.HTTPSHandler):

	def __init__(self, mockFunc):
		self.full_url = ''
		self.method = ''
		self.set_mock(mockFunc)

	def https_open(self, req):
		self.full_url = req.get_full_url()
		self.method = req.get_method()
		return self._mock(req)

	def set_mock(self, mockFunc):
		self._mock = mockFunc



if __name__ == '__main__':
	unittest.main()
