from datetime import date
import json

from flaskr_skills import FlaskrSkillsTestCase

class TechRoot(FlaskrSkillsTestCase):
    def test_list_techs_only(self):
        rv = self.get('/techs')
        apiTechs = json.loads(rv.data)

        techOnly = tuple(self.get_tech_names_from_fixture())
        nonTech = tuple(skill['name'] for skill in apiTechs if skill['name'] not in techOnly)

        assert len(nonTech) == 0

    def test_techs_calculate_freshness(self):
        rv = self.get('/techs')
        techs = json.loads(rv.data)

        freshness = {}
        for tech in self.get_techs_from_fixture():
            exercised = date(*map(lambda n: int(n), tech['exercised'].split('-')))

            staleFactor = ((date.today() - exercised).days / 30) / 6

            freshness[tech['name']] = (tech['months'] * 0.33 ** staleFactor) / tech['months']

        for tech in techs:
            assert tech['freshness'] == freshness[tech['name']]

    def test_techs_ordered_by_freshness(self):
        rv = self.get('/techs')
        techs = json.loads(rv.data)

        prev = techs[0]
        for tech in techs:
            assert prev['freshness'] >= tech['freshness']
            prev = tech

    def get_techs_from_fixture(self):
        return (skill for skill in self.skills if skill['category'] == 'tech')

    def get_tech_names_from_fixture(self):
        return (skill['name'] for skill in self.skills if skill['category'] == 'tech')

    def test_get_tech(self):
        rv = self.get('/techs')
        apiTechs = json.loads(rv.data)

        rv = self.get('/techs/' + apiTechs[0]['key'])
        skill = json.loads(rv.data)

        assert skill['name'] == apiTechs[0]['name']
