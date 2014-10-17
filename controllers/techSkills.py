import base

class TechSkillsHandler(base.BaseHandler):
    def get(self):
        self.data['content'] = 'Technical Skills'
        template = base.template_engine.get_template('tech-skills.html')
        self.response.write(template.render(self.data))
