import re
import json

from flaskr_skills import FlaskrSkillsTestCase

minimalSkill = {
  "name": "Minimal Skill",
  "exercised": "2015-03-01",
  "months": 12,
  "description": "<p>The bare minimum required for a skill to be added.</p>",
  "category": "tech"
}

completeSkill = {
  "name": "Complete Skill",
  "exercised": "2015-03-01",
  "months": 12,
  "complement": ["Minimum Skill"],
  "tags": ['Skill'],
  "description": "<p>All fields populated.</p>",
  "category": "tech"
}

contentType = 'application/json'

class SkillsRoot(FlaskrSkillsTestCase):


    def test_list_all_skills(self):
        rv = self.get('/skills')
        apiSkills = json.loads(rv.data)

        assert len(apiSkills) == len(self.skills)

    def test_skills_include_key(self):
        rv = self.get('/skills')
        apiSkills = json.loads(rv.data)

        for skill in apiSkills:
            assert 'key' in skill

    def test_get_skill(self):
        rv = self.get('/skills')
        apiSkills = json.loads(rv.data)

        rv = self.get('/skills/' + apiSkills[0]['key'])
        skill = json.loads(rv.data)

        assert skill['name'] == apiSkills[0]['name']

    def test_post_requires_auth(self):
        rv = self.post('/skills')

        assert rv.status == '403 FORBIDDEN'

    def test_post_adds_skill(self):
        self.login()
        rv = self.post('/skills', data=json.dumps(minimalSkill), content_type=contentType)

        assert rv.status == '201 CREATED'

        key = re.match(self.base_url + '(/skills/\w+)', rv.headers['Location'])
        assert key
        rv = self.get(key.group(1))

        addedSkill = json.loads(rv.data)

        self.assert_added_skill_correct(addedSkill, minimalSkill)

    def test_post_adds_multiple_skills(self):

        skills = [minimalSkill, completeSkill]

        self.login()
        rv = self.post('/skills', data=json.dumps(skills), content_type=contentType)

        assert rv.status == '201 CREATED'

        locations = json.loads(rv.data)
        assert len(locations) == 2

        for uri in locations:

            key = re.match(self.base_url + '(/skills/\w+)', uri)
            assert key

            rv = self.get(key.group(1))
            skill = json.loads(rv.data)

            if skill['name'] == 'Minimal Skill':
                self.assert_added_skill_correct(skill, minimalSkill)

            else:
                self.assert_added_skill_correct(skill, completeSkill)

    def test_incorrect_content_type_returns_400(self):
        self.login()
        rv = self.post('/skills', data=json.dumps(minimalSkill))

        assert rv.status == '400 BAD REQUEST'

        error = json.loads(rv.data)
        assert error['message'] == 'Invalid Content-Type'

    def test_invalid_json_returns_400(self):
        self.login()
        rv = self.post('/skills', data='This is not json', content_type=contentType)

        assert rv.status == '400 BAD REQUEST'

        error = json.loads(rv.data)
        assert error['message'] == 'No JSON object could be decoded'

    def test_sending_wrong_type_returns_400(self):
        badJson = minimalSkill.copy()
        badJson['tags'] = 'This is not an array'

        self.login()

        rv = self.post('/skills', data=json.dumps(badJson), content_type=contentType)

        assert rv.status == '400 BAD REQUEST'

        error = json.loads(rv.data)
        assert error['message'] == "Expected list or tuple, got u'This is not an array'"

    def assert_added_skill_correct(self, addedSkill, postedModel):
        for key, value in postedModel.items():
            assert addedSkill[key] == value
