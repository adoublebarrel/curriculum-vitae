import re
import base
import logging
from google.appengine.api import mail
from markupsafe import Markup, escape
import urllib2, urllib
import json

class ContactHandler(base.BaseHandler):
    def get(self):
        template = base.template_engine.get_template('contact/form.html')

        self.response.write(template.render(self.data))

    def post(self):
        recaptchaSecret = '6LdT9_4SAAAAAKvBtC9hi-nf7kaoQeGDIdMcXxXi'

        if not self.hasRequiredFields(self.request):
        	self.response.status = 400
        	return

        if not self.isEmailValid(self.request.get('email')):
            self.data['name'] 		= self.request.get('name').strip()
            self.data['email'] 		= self.request.get('email').strip()
            self.data['message'] 	= self.request.get('message').strip()

            template = base.template_engine.get_template('contact/form.html')
            self.response.write(template.render(self.data))

            return

        recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify'
        queryString = urllib.urlencode((
            ('secret', recaptchaSecret),
            ('response', self.request.get('g-recaptcha-response'))
            # request.client_addr appears to be unavailable in GAE live environment
            # ('remoteip', self.request.client_addr)
            ))

        try:
            recaptchaResponse  = urllib2.urlopen(recaptchaUrl + '?' + queryString)
            recaptchaJson = json.loads(recaptchaResponse.read())

            if recaptchaJson['success'] is False:
                if  'invalid-input-secret' in recaptchaJson['error-codes']:
                    self.sendBadSecretMail(recaptchaSecret)
                    self.redirect("/contact/misconfigured")

                    return

                if 'invalid-input-response' in recaptchaJson['error-codes']:
                    self.redirect("/contact/not-human")

                    return

        except urllib2.URLError:
            # If we can't contact recaptcha, go ahead and send the message
            # anyway. No point penalising the user because the service is
            # temporarily down or unavailable
            pass

    	(name, message, email) = (escape(self.request.get('name').strip()), escape(self.request.get('message').strip()), escape(self.request.get('email').strip()))
    	self.sendMessage(name, message, email)

        self.redirect("/contact/sent")

    def hasRequiredFields(self, request):
        requiredFields = (
            'email',
            'g-recaptcha-response',
            'message',
            'name'
            )

        for field in requiredFields:
            if request.get(field, '') == '':
        		return False

    	return True

    def sendBadSecretMail(self, secret):
        mail.send_mail(
            'alex.bransbywilliams@gmail.com',
            'alex.bransbywilliams@gmail.com',
            'CV: Invalid recaptcha secret',
            'Google Recaptcha says the secret "' + secret + '" is invalid. Contact form is broken.')

    def sendMessage(self, name, message, email):
        mail.send_mail(
        	'alex.bransbywilliams@gmail.com',
        	'alex.bransbywilliams@gmail.com',
        	'CV: Message from ' + name,
        	message + "\n\nSenders Email: " + email)

    def isEmailValid(self, email):
        pattern = re.compile('[^\s.]@[^\s.]')
        return pattern.search(email) is not None
