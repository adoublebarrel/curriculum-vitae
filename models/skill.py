from google.appengine.ext import ndb

class Skill(ndb.Model):
    name = ndb.StringProperty(required=True)
    category = ndb.Enumerateroperty(required=True)
    description = ndb.TextProperty()
    years = ndb.NumberProperty(required=True)
    hiatus = ndb.NumberProperty(required=True)
    will = ndb.TextProperty(required=False)
    wont = ndb.TextProperty(required=False)
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)