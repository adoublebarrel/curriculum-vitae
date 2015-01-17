from google.appengine.ext import ndb

class Cv(ndb.Model):
	name = ndb.StringProperty(required=True)
	name_uri = ndb.ComputedProperty(lambda self: self.name.lower().replace(' ', '-'))
	lead_in = ndb.TextProperty(required=True)
	tech_skills = ndb.KeyProperty(repeated=True)
	dev_methods = ndb.KeyProperty(repeated=True)
	created = ndb.DateTimeProperty(auto_now_add=True)
	updated = ndb.DateTimeProperty(auto_now=True)
