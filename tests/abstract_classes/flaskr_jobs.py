import json

from datetime import date
from flaskr_base import FlaskrTestCase
from flaskr_base import FIXTURES

from google.appengine.api import users
from google.appengine.api import memcache
from google.appengine.ext import ndb
from models.job import Job

class FlaskrJobsTestCase(FlaskrTestCase):

    def initTestbed(self):
        self.testbed.init_memcache_stub()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_user_stub()

        rawJobs = open(FIXTURES + "/jobs.json")
        self.jobs = json.load(rawJobs)

        for aJob in self.jobs:

            j = Job(
                company = aJob.get('company'),
                started = self.dateFromString(aJob.get('started')),
                role = aJob.get('role'),
                description = aJob.get('description'),
                techs = aJob.get('techs'),
                achievements = aJob.get('achievements', ()),
                logo = aJob.get('logo', '')
            )

            ended = aJob.get('ended', False)

            if ended:
                j.ended = self.dateFromString(ended)

            j.put()

    def login(self, email='alex@tttchicken.com', id='123', is_admin=False):
        assert not users.get_current_user()

        self.testbed.setup_env(
            user_email=email,
            user_id=id,
            user_is_admin = '1' if is_admin else '0',
            overwrite = True
        )

    def dateFromString(self, iso810):
        return date(*map(lambda n: int(n), iso810.split('-')))
