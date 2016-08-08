import json
from datetime import date
from flaskr_base import FlaskrTestCase
from flaskr_base import FIXTURES

from google.appengine.api import users
from google.appengine.api import memcache
from google.appengine.ext import ndb
from models.skill import Skill

class FlaskrSkillsTestCase(FlaskrTestCase):

    def initTestbed(self):
        self.testbed.init_memcache_stub()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_user_stub()

        rawSkills = open(FIXTURES + "/skills2.json")
        self.skills = json.load(rawSkills)

        for aSkill in self.skills:
            exercised = aSkill.get('exercised')

            s = Skill(
                name = aSkill.get('name'),
                months = int(aSkill.get('months')),
                complement = aSkill.get('complement', ()),
                description = aSkill.get('description'),
                category = aSkill.get('category'),
                exercised = date(*map(lambda n: int(n) , exercised.split('-')))
            ).put()

    def login(self, email='alex@tttchicken.com', id='123', is_admin=False):
        assert not users.get_current_user()

        self.testbed.setup_env(
            user_email=email,
            user_id=id,
            user_is_admin = '1' if is_admin else '0',
            overwrite = True
        )
