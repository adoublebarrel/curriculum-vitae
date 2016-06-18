import json

from flaskr_base import FlaskrTestCase

class CvRoot(FlaskrTestCase):

    def test_endpoint_categories(self):
        rv = self.get('/')
        categories = json.loads(rv.data)

        assert categories['tech_experience'] == 'https://abransbywilliams.appspot.com/tech{/tech_id}'
        assert categories['search_tech_experience']  == 'https://abransbywilliams.appspot.com/search/tech?q={query}'
