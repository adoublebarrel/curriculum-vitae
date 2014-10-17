import base

class SynopsisHandler(base.BaseHandler):
    def get(self):
        self.data['content'] = 'Synopsis'
        template = base.template_engine.get_template('synopsis.html')
        self.response.write(template.render(self.data))
