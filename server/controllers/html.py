import logging
import base

class ContentHandler(base.BaseHandler):
    def get(self):
    	name = self.request.route.name

    	if name.find('-') > -1:
    		name = name.replace('-', '/')

        template = base.template_engine.get_template(name + '.html')

        self.response.write(template.render(self.data))
