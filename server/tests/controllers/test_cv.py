import unittest
import logging
import json

import webapp2
import webtest

from google.appengine.ext import testbed
from google.appengine.api import memcache
from google.appengine.ext import ndb

from server.controllers.cv import CvListHandler, CvHandler
from server.models.cv import Cv
from server.models.skill import Skill

FIXTURES = "tests/fixtures"

class testCvHandlers(unittest.TestCase):
	def setUp(self):
		app = webapp2.WSGIApplication([
			('/cv', CvListHandler),
			(r'/cv/([\w\-]+\w+$)', CvHandler)
		])

		self.testApp = webtest.TestApp(app)
		self.testbed = testbed.Testbed()
		self.testbed.activate()
		self.testbed.init_memcache_stub()
		self.testbed.init_datastore_v3_stub()

		skills = self.importSkills()
		self.cv = self.importCv()

	def teardown(self):
		self.testbed.deactivate()

	def testCvList(self):
		dataCv = Cv.query().fetch()

		response = self.testApp.get('/cv')
		htmlCv = response.html.find(id='cv-list').find_all("li")


		self.assertEqual(response.content_type, 'text/html')
		self.assertEqual(len(htmlCv), len(dataCv))

		self.assertEqual("/cv/" + dataCv[0].name_uri, htmlCv[0].a['href'])
		self.assertEqual(dataCv[0].name, htmlCv[0].a.string)

	def testCv(self):
		dataCv = Cv.query().get()

		query = Skill.query(Skill.key.IN(dataCv.tech_skills))
		dataSkills = self.extractSortedNames(query)

		query = Skill.query(Skill.key.IN(dataCv.dev_methods))
		dataMethods = self.extractSortedNames(query)		

		response = self.testApp.get('/cv/' + dataCv.name_uri)
		htmlCv = response.html.find(id='cv')

		self.assertEqual(response.content_type, 'text/html')

		htmlName = response.html.find('h1').small.string
		self.assertEqual(dataCv.name, htmlName)

		htmlLead_in = unicode(response.html.find(id='lead-in').p)
		self.assertEqual(dataCv.lead_in, htmlLead_in)


		htmlSkills = []
		for skill in response.html.find(id='skills').find_all('li'):
			htmlSkills.append(skill.string)

		self.assertEqual(dataSkills, htmlSkills)

		htmlMethods = []
		for method in response.html.find(id='methods').find_all('li'):
			htmlMethods.append(method.string)

		self.assertEqual(dataMethods, htmlMethods)

	def extractSortedNames(self, query):
		names = []
		for skill in query.order(Skill.name).iter(projection=[Skill.name]):
			names.append(skill.name)

		return names

	def importSkills(self):
		rawSkills = open(FIXTURES + "/models/skill/general.json")
		skills = json.load(rawSkills)

		for aSkill in skills:
			s = Skill(
				name=aSkill.get('name'),
				months=int(aSkill.get('Years')*12),
				complement=aSkill.get('complement', '').split(','),
				description=aSkill.get('description'),
				will=aSkill.get('will', ''),
				wont=aSkill.get('wont',''),
				category=aSkill.get('category')
			).put()


	def importCv(self):
		skillKeys, methodKeys = [], []
		rawCv = open(FIXTURES + "/models/cv/general.json")
		cv = json.load(rawCv)

		for aCv in cv:
			q = Skill.query(Skill.name.IN(aCv['tech_skills']))

			skillKeys = q.fetch(keys_only=True)
			
			q = Skill.query(Skill.name.IN(aCv['dev_methods']))
			methodKeys = q.fetch(keys_only=True)

			cv = Cv(
				name=aCv.get('name'),
				lead_in=aCv.get('lead_in'),
				tech_skills=skillKeys,
				dev_methods=methodKeys,
			).put()


