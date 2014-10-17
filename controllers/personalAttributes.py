import base

class PersonalAttributesHandler(base.BaseHandler):
    def get(self):
        self.data['content'] = 'Personal Attributes'
        template = base.template_engine.get_template('personal-attributes.html')
        self.response.write(template.render(self.data))
