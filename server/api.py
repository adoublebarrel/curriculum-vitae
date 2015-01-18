import webapp2

app = webapp2.WSGIApplication([
    webapp2.Route('/skills', handler='server.controllers.techSkills.SkillsListHandler'),
    webapp2.Route('/skills/<skillKey:\w+\-?\w+>', handler='server.controllers.skills.SkillHandler'),
    webapp2.Route('/import/skills', handler='server.controllers.import.ImportSkillsHandler'),
    webapp2.Route('/import/cv', handler='server.controllers.import.ImportCvHandler'),
    webapp2.Route('/import/person', handler='server.controllers.import.ImportPersonsHandler')
], debug=False)