import base, json, logging

from google.appengine.api import users
from google.appengine.ext import ndb

from server.models.cv import Cv
from server.models.skill import Skill
from server.models.person import Person

class CvListHandler(base.BaseHandler):
	def get(self):
		template = base.template_engine.get_template('cv/list.html')

		self.data['cv'] = Cv.query()
		self.response.write(template.render(self.data))

class CvHandler(base.BaseHandler):
	def get(self, key):
		template = base.template_engine.get_template('cv/cv.html')
		cv_key = ndb.Key(urlsafe=key)

		self.data['cv'] = cv_key.get()
		self.data['tech_skills'] = Skill.query(Skill.key.IN(self.data['cv'].tech_skills)).order(Skill.name)
		self.data['dev_methods'] = Skill.query(Skill.key.IN(self.data['cv'].dev_methods)).order(Skill.name)
		self.data['showFull'] = False

		self.response.write(template.render(self.data))

class FullCvHandler(base.BaseHandler):
	def get(self, key):
		template = base.template_engine.get_template('cv/cv.html')
		cv_key = ndb.Key(urlsafe=key)

		self.data['cv'] = cv_key.get()
		self.data['tech_skills'] = Skill.query(Skill.key.IN(self.data['cv'].tech_skills)).order(Skill.name)
		self.data['dev_methods'] = Skill.query(Skill.key.IN(self.data['cv'].dev_methods)).order(Skill.name)
		self.data['showFull'] = True
		self.data['person'] = Person.query().get()

		self.response.write(template.render(self.data))
		