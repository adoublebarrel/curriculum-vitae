import base

class DevMethodsHandler(base.BaseHandler):
    def get(self):
        self.data['content'] = 'Development Methods'
        template = base.template_engine.get_template('dev-methods.html')
        self.response.write(template.render(self.data))
