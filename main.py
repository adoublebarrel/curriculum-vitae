import re
import logging
from markupsafe import Markup, escape
import urllib2, urllib
import json

from flask import Flask, request, jsonify

from google.appengine.ext import ndb
from models.skill import Skill

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['JSON_AS_ASCII'] = False

# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.


@app.route('/')
def categories():
    """Return api catgeories ->  RFC 6570 URI templates."""
    return jsonify({
        'tech_experience': 'https://abransbywilliams.appspot.com/tech{/tech_id}',
        'search_tech_experience': 'https://abransbywilliams.appspot.com/search/tech?q={query}'
    })

@app.route('/tech')
def tech_skills():
    skills = []
    #skills = Skill.query().order(-Skill.months, Skill.name_lower).fetch()
    result = Skill.query(Skill.category == 'tech').order(-Skill.freshness)

    for skill in result:
        skill = skill.to_dict(exclude=('created', 'updated'))
        skill['exercised'] = str(skill['exercised'])
        skills.append(skill)

    return json.dumps(skills)


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

@app.after_request
def standard_headers(response):
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    response.headers['Content-Security-Policy'] = "default-src 'none'"
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubdomains; preload'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'deny'
    response.headers['X-XSS-Protection'] = '1; mode=block'

    return response
