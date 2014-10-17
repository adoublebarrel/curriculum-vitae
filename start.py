import webapp2
import controllers

app = webapp2.WSGIApplication([
    ('/', controllers.SynopsisHandler),
    ('/technical-skills', controllers.TechSkillsHandler),
    ('/development-methods', controllers.DevMethodsHandler),
    ('/personal-attributes', controllers.PersonalAttributesHandler),
    ('/employment-history', controllers.EmploymentHandler)
], debug=True)