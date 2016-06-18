from datetime import date
import json

from flaskr_skills import FlaskrSkillsTestCase

class TechRoot(FlaskrSkillsTestCase):
    def test_list_techs_only(self):
        rv = self.get('/tech')
        techs = json.loads(rv.data)

        techOnly = self.get_tech_names_from_fixture()
        nonTech = (skill['name'] for skill in techs if skill['name'] not in techOnly)
        print tuple(techOnly)
        assert len(tuple(nonTech)) == 0

    def test_techs_calculate_freshness(self):
        rv = self.get('/tech')
        techs = json.loads(rv.data)

        freshness = {}
        for tech in self.get_techs_from_fixture():
            exercised = date(*map(lambda n: int(n), tech['exercised'].split('-')))

            staleFactor = ((date.today() - exercised).days / 30) / 6

            freshness[tech['name']] = tech['months'] * 0.33 ** staleFactor

        for tech in techs:
            assert tech['freshness'] == freshness[tech['name']]

    def test_techs_ordered_by_freshness(self):
        rv = self.get('/tech')
        techs = json.loads(rv.data)

        prev = techs[0]
        for tech in techs:
            assert prev['freshness'] >= tech['freshness']
            prev = tech

    def get_techs_from_fixture(self):
        return (skill for skill in self.skills if skill['category'] == 'tech')

    def get_tech_names_from_fixture(self):
        return (skill['name'] for skill in self.skills if skill['category'] == 'tech')
