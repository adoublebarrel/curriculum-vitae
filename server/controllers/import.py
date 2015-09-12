import base, json, logging

from google.appengine.ext import ndb

from server.models.cv import Cv
from server.models.skill import Skill
from server.models.person import Person

class ImportCvHandler(base.BaseHandler):
	def get(self):
		q = Cv.query()

		for key in q.iter(keys_only=True):
			key.delete()


		skillKeys, methodKeys = [], []
		rawCv = open("server/models/fixtures/cv.json")
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

		self.response.write("<h1>Import Completed</h1>")

class ImportSkillsHandler(base.BaseHandler):
	def get(self):
		q = Skill.query()

		for key in q.iter(keys_only=True):
			key.delete()

		rawSkills = open("server/models/fixtures/skills.json")
		skills = json.load(rawSkills)

		for aSkill in skills:
			s = Skill(
				name=aSkill.get('name'),
				months=int(aSkill.get('Years')*12),
				complement=aSkill.get('complement', '').split(','),
				description=aSkill.get('description'),
				will=aSkill.get('will', ''),
				wont=aSkill.get('wont',''),
				category=aSkill.get('category'),
				tags=aSkill.get('tags', [])
			).put()

		self.response.write("<h1>Import Completed</h1>")

class ImportPersonsHandler(base.BaseHandler):
	def get(self):
		rawPersons = open("server/models/fixtures/person.json")
		persons = json.load(rawPersons)

		for aPerson in persons:
			p = Person(
				name=aPerson.get('name'),
				address=aPerson.get('address'),
				mobile=aPerson.get('mobile'),
				email=aPerson.get('email')
			).put()

		self.response.write("<h1>Import Completed</h1>")
