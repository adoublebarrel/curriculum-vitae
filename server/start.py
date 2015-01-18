import webapp2

app = webapp2.WSGIApplication([
    webapp2.Route('/', handler='server.controllers.html.ContentHandler', name='home'),
    webapp2.Route('/technical-skills', handler='server.controllers.skills.TechSkillsHandler', name='technical-skills'),
    webapp2.Route('/development-methods', handler='server.controllers.skills.MethodSkillsHandler', name='development-methods'),
    webapp2.Route('/leadership', handler='server.controllers.skills.LeadershipSkillsHandler', name='leadership'),
    webapp2.Route('/attributes', handler='server.controllers.html.ContentHandler', name='attributes'),
    webapp2.Route('/employment', 'server.controllers.html.ContentHandler', name='employment'),
    webapp2.Route('/contact', handler='server.controllers.contact.ContactHandler', name='contact-form'),
    webapp2.Route('/contact/sent', handler='server.controllers.html.ContentHandler', name='contact-sent'),
    webapp2.Route('/contact/not-human', handler='server.controllers.html.ContentHandler', name='contact-nothuman'),
    webapp2.Route('/contact/misconfigured', handler='server.controllers.html.ContentHandler', name='contact-misconfig'),
    webapp2.Route('/cv', handler='server.controllers.cv.CvListHandler', name='cv-list'),
    webapp2.Route('/cv/<name:[\w\-]+\w+>/full', handler='server.controllers.cv.FullCvHandler', name='full-cv'),
    webapp2.Route('/cv/<name:[\w\-]+\w+>', handler='server.controllers.cv.CvHandler', name='cv'),
    webapp2.Route('/copyright', handler='server.controllers.html.ContentHandler', name='copyright'),
    webapp2.Route('/privacy-policy', handler='server.controllers.html.ContentHandler', name='privacyPolicy'),
    webapp2.Route('/cookie-policy', handler='server.controllers.html.ContentHandler', name='cookiePolicy')
], debug=False)