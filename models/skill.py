from datetime import date
from google.appengine.ext import ndb

class Skill(ndb.Model):
    name = ndb.StringProperty(required=True)
    name_lower = ndb.ComputedProperty(lambda self: self.name.lower())
    description = ndb.TextProperty()
    months = ndb.IntegerProperty(required=True)
    exercised = ndb.DateProperty(required=True)
    freshness = ndb.ComputedProperty(lambda self: self.calculate_freshness())
    complement = ndb.StringProperty(repeated=True)
    category = ndb.StringProperty(required=True, choices=['tech','method', 'team'])
    tags = ndb.StringProperty(repeated=True)
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    def calculate_freshness(self):
        lapse =  date.today() - self.exercised
        staleFactor = (lapse.days / 30) / 6
        divisor = self.months

        if divisor == 0:
            divisor = 1

        return (self.months * 0.33 ** staleFactor) / divisor
