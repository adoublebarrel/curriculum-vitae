import json

from flaskr_base import FlaskrTestCase

class CvRoot(FlaskrTestCase):

    def test_endpoint_categories(self):
        rv = self.get('/')
        categories = json.loads(rv.data)

        assert categories['tech_experience_url'] == self.base_url + '/techs{/tech_key}'
        assert categories['search_tech_experience_url']  == self.base_url + '/search/tech?q={query}'
        assert categories['skills_url'] == self.base_url + '/skills{/skill_key}'
        assert categories['job_history_url'] == self.base_url + '/jobs{/job_key}'
