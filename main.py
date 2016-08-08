import re
import logging
from markupsafe import Markup, escape
import urllib2, urllib
from datetime import date
import json

from flask import Flask, request, jsonify, abort, url_for

from google.appengine.api import users
from google.appengine.api.datastore_errors import *
from google.appengine.ext import ndb
from models.skill import Skill
from models.job import Job

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['PREFERRED_URL_SCHEME'] = 'https'
app.config['JSON_AS_ASCII'] = False

# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.


@app.route('/')
def categories():
    """Return api catgeories ->  RFC 6570 URI templates."""
    return jsonify({
        'tech_experience_url': request.base_url + 'techs{/tech_key}',
        'search_tech_experience_url': request.base_url + 'search/tech?q={query}',
        'skills_url': request.base_url + 'skills{/skill_key}',
        'job_history_url': request.base_url + 'jobs{/job_key}'
    })

@app.route('/techs')
def list_tech():
    skills = []
    #skills = Skill.query().order(-Skill.months, Skill.name_lower).fetch()
    result = Skill.query(Skill.category == 'tech').order(-Skill.freshness, -Skill.months, Skill.name_lower).fetch()

    return jsonify_skills(result)

@app.route('/techs/<key>')
def get_tech(key):
    tech = ndb.Key(urlsafe=key).get()

    return json.dumps(dict_skill(tech))

@app.route('/skills')
def skills():
    skills = []
    result = Skill.query().fetch()

    return jsonify_skills(result)

@app.route('/skills', methods=['POST'])
def add_skill():
    #authorise() or abort(403)
    json_content_type(request.headers['Content-Type']) or abort(400)

    headers = {}
    locations = []

    data = json.loads(request.data)

    try:

        data['exercised'] = rfc822_date_string_to_date(data['exercised'])
        key = Skill(**data).put()

        headers['Location'] = url_for('get_skill', key=key.urlsafe())

        return '', 201, headers

    except TypeError:

        skills = []

        for item in data:
            item['exercised'] = rfc822_date_string_to_date(item['exercised'])
            skills.append(Skill(**item))

        for key in ndb.put_multi(skills):
            locations.append(request.url_root.rstrip('/') + url_for('get_skill', key=key.urlsafe()))

        return json.dumps(locations), 201

@app.route('/skills/<key>')
def get_skill(key):
    skill = ndb.Key(urlsafe=key).get()

    return json.dumps(dict_skill(skill))

@app.route('/jobs')
def list_jobs():
    result = Job.query().order(-Job.started).fetch()

    return jsonify_jobs(result)

@app.route('/jobs/<key>')
def get_job(key):
    job = ndb.Key(urlsafe=key).get()

    return json.dumps(dict_job(job))

@app.route('/jobs', methods=['POST'])
def add_job():
    authorise() or abort(403)
    json_content_type(request.headers['Content-Type']) or abort(400)

    headers = {}
    locations = []

    data = json.loads(request.data)

    try:
        data['started'] = rfc822_date_string_to_date(data['started'])
        if 'ended' in data:
            data['ended'] = rfc822_date_string_to_date(data['ended'])

        key = Job(**data).put()

        headers['Location'] = url_for('get_job', key=key.urlsafe())

        return '', 201, headers

    except TypeError:

        jobs = []

        for item in data:
            item['started'] = rfc822_date_string_to_date(item['started'])
            if 'ended' in item:
                item['ended'] = rfc822_date_string_to_date(item['ended'])

            jobs.append(Job(**item))

        for key in ndb.put_multi(jobs):
            locations.append(request.url_root.rstrip('/') + url_for('get_job', key=key.urlsafe()))

        return json.dumps(locations), 201

@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.' + request.url, 404

@app.errorhandler(400)
def invalid_content_type(e):
    return json.dumps({ 'message': 'Invalid Content-Type'}), 400

@app.errorhandler(ValueError)
def not_json(e):
    return json.dumps({ 'message': e.message }), 400

@app.errorhandler(BadValueError)
def bad_type_in_json_payload(e):
    return json.dumps({ 'message': e.message}), 400

@app.after_request
def standard_headers(response):
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    response.headers['Content-Security-Policy'] = "default-src 'none'"
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubdomains; preload'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'deny'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Access-Control-Allow-Origin'] = "*"

    return response

def jsonify_skills(skillsResult):
    skills = []
    for record in skillsResult:
        skills.append(dict_skill(record))

    return json.dumps(skills)

def dict_skill(record):
    skill = record.to_dict(exclude=('created', 'updated'))
    skill['exercised'] = str(skill['exercised'])
    skill['key'] = record.key.urlsafe()

    return skill

def jsonify_jobs(jobsResult):
    jobs = []
    for record in jobsResult:
        jobs.append(dict_job(record))

    return json.dumps(jobs)

def dict_job(record):
    job = record.to_dict(exclude=('created', 'updated'))
    job['key'] = record.key.urlsafe()
    job['started'] = str(job['started'])

    if job['ended']:
        job['ended'] = str(job['ended'])

    return job

def authorise():
    user = users.get_current_user()

    if user and user.email() == 'alex@tttchicken.com':
        return True

    return False

def rfc822_date_string_to_date(dateString):
    return date(*map(lambda n: int(n), dateString.split('-')))

def json_content_type(contentType):
    if contentType == 'application/json':
        return True

    return False
