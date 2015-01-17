import logging
import base

class ContentHandler(base.BaseHandler):
    def get(self):
    	logging.warning(self.request.route)
        template = base.template_engine.get_template(self.request.route.name + '.html')

        self.response.write(template.render(self.data))