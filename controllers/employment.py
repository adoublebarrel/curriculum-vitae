import base

class EmploymentHandler(base.BaseHandler):
    def get(self):
        self.data['content'] = 'Employment History'
        template = base.template_engine.get_template('employment-history.html')
        self.response.write(template.render(self.data))
