import base
import json
import logging
from google.appengine.ext import ndb
from server.models.skill import Skill

class TechSkillsHandler(base.BaseHandler):
    def get(self):
        self.data['content'] = 'Technical Skills'
        template = base.template_engine.get_template('skills.html')

        self.data['skills'] = Skill.query(Skill.category == 'tech').order(-Skill.months, Skill.name_lower)
        self.response.write(template.render(self.data))

class MethodSkillsHandler(base.BaseHandler):
    def get(self):
        template = base.template_engine.get_template('list-with-content.html')

        self.data['title'] = "Development Methods"
        self.data['list'] = Skill.query(Skill.category == 'method').order(-Skill.months, Skill.name_lower)
        self.response.write(template.render(self.data))

class LeadershipSkillsHandler(base.BaseHandler):
    def get(self):
        template = base.template_engine.get_template('list-with-content.html')

        self.data['title'] = 'Leadership Skills'
        self.data['list'] = Skill.query(Skill.category == 'leadership').order(-Skill.months, Skill.name_lower)
        self.response.write(template.render(self.data))

class SkillsListHandler(base.BaseHandler):
	def get(self):
		skills = Skill.query().order(-Skill.months, Skill.name_lower).fetch()
		self.response.headers['Content-Type'] = 'application/json'

		for skill in skills:
			self.response.write(json.dumps(skill.to_dict(exclude=['created','updated']),ensure_ascii=False,skipkeys=True))


class SkillHandler(base.BaseHandler):
	def get(self, skillKey):
		skill_key = ndb.Key(urlsafe=skillKey)
		skill = skill_key.get()

		self.response.headers['Content-Type'] = 'application/json'
		self.response.write(json.dumps(skill.to_dict(exclude=['created','updated']),ensure_ascii=False,skipkeys=True))
