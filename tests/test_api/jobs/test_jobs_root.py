from datetime import date
import json
import re

from flaskr_jobs import FlaskrJobsTestCase

minimalJob = {
    "company": "ADP",
    "started": "2015-05-14",
    "role": "Software Engineer",
    "description": "I worked as one of several senior developers on ADPs next generation platform for human capital and payroll applications.",
    "techs": ["NodeJS", "Javascript", "Grunt", "Gulp", "Spark"]
}

completeJob = {
    "company": "Tic-Tac-Toe Chicken",
    "started": "2016-01-01",
    "ended": "2016-07-28",
    "role": "Senior Software Engineer",
    "logo": "https://cv-images.appspot.com/jobs/ttt-chicken.png",
    "description": "I worked as a consultant and developer on the production of a prototype psychometric questionnaire web application.",
    "achievements": ["Completed a datastore design that made use of eventual consistency to enable the smooth scaling of macro use cases while ensuring strong consistency at the candidate level.", "Ensured interoperability with the startups existing processing system", "Produced a low cost but fully functional prototype that was to be used a set of trials for market research"],
    "techs": ["Google App Engine", "Google Datastore", "Python", "Flask"]
}

contentType = 'application/json'

class JobsRoot(FlaskrJobsTestCase):
    def test_list_all_jobs(self):
        rv = self.get('/jobs')
        apiJobs = json.loads(rv.data)

        assert len(apiJobs) == len(self.jobs)

    def test_jobs_ordered_by_started_descending(self):
        rv = self.get('/jobs')
        jobs = json.loads(rv.data)

        previous = jobs[0]
        for aJob in jobs:
            assert previous['started'] >= aJob['started']
            previous = aJob

    def test_jobs_include_id(self):
        rv = self.get('/jobs')
        apiJobs = json.loads(rv.data)

        for job in apiJobs:
            assert 'key' in job

    def test_get_job(self):
        rv = self.get('/jobs')
        apiJobs = json.loads(rv.data)

        rv = self.get('/jobs/' + apiJobs[0]['key'])
        job = json.loads(rv.data)

        assert job['company'] == apiJobs[0]['company']

    def test_post_requires_auth(self):
        rv = self.post('/jobs')

        assert rv.status == '403 FORBIDDEN'

    def test_post_adds_job(self):
        self.login()
        rv = self.post('/jobs', data=json.dumps(minimalJob), content_type=contentType)

        assert rv.status == '201 CREATED'
        key = re.match(self.base_url + '(/jobs/\w+)', rv.headers['Location'])
        assert key
        rv = self.get(key.group(1))

        addedJob = json.loads(rv.data)

        self.assert_added_job_correct(addedJob, minimalJob)

    def test_post_adds_multiple_jobs(self):
        jobs = [minimalJob, completeJob]

        self.login()
        rv = self.post('/jobs', data=json.dumps(jobs), content_type=contentType)

        assert rv.status == '201 CREATED'

        locations = json.loads(rv.data)
        assert len(locations) == 2

        for uri in locations:

            key = re.match(self.base_url + '(/jobs/\w+)', uri)
            assert key

            rv = self.get(key.group(1))
            job = json.loads(rv.data)

            if job['company'] == 'ADP':
                self.assert_added_job_correct(job, minimalJob)

            else:
                self.assert_added_job_correct(job, completeJob)

    def assert_added_job_correct(self, addedJob, postedModel):
        for key, value in postedModel.items():
            assert addedJob[key] == value
