from datetime import date
from google.appengine.ext import ndb

class Job(ndb.Model):
    company = ndb.StringProperty(required=True)
    role = ndb.StringProperty(required=True)
    started = ndb.DateProperty(required=True)
    ended = ndb.DateProperty()
    description = ndb.TextProperty(required=True)
    achievements = ndb.StringProperty(repeated=True)
    techs = ndb.StringProperty(repeated=True)
    url = ndb.StringProperty()
    logo = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
