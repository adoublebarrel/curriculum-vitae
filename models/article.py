from google.appengine.ext import ndb

class Article(ndb.Model):
    Title = ndb.StringProperty(required=True)
    Strap = ndb.StringProperty()
    Synopsis = ndb.TextProperty(required=True)
    Body = ndb.TextProperty(required=True)
    Conclusion = ndb.TextProperty(required=True)
    category = ndb.Enumerateroperty(required=True)
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)