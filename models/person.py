from google.appengine.ext import ndb

class Person(ndb.Model):
	name = ndb.StringProperty(required=True)
	address = ndb.TextProperty(required=False)
	mobile = ndb.StringProperty(required=False)
	email = ndb.StringProperty(required=False)
	created = ndb.DateTimeProperty(auto_now_add=True)
	updated = ndb.DateTimeProperty(auto_now=True)
