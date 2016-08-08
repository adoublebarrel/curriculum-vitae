import os
import unittest

from google.appengine.ext import testbed

import main

FIXTURES = "tests/fixtures"

class FlaskrTestCase(unittest.TestCase):

    def setUp(self):
        self.base_url = 'https://commandline'
        main.app.config['TESTING'] = True

        self.app = main.app
        self.test_client = main.app.test_client()

        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.initTestbed();

    def tearDown(self):
        self.testbed.deactivate()

    def initTestbed(self):
        pass

    def get(self, *args, **keywords):
        rv = self.test_client.get(base_url=self.base_url, *args, **keywords)

        self.assert_standard_headers(rv)

        return rv

    def post(self, *args, **keywords):
        rv = self.test_client.post(base_url=self.base_url, *args, **keywords)

        self.assert_standard_headers(rv)

        return rv

    def assert_standard_headers(self, rv):
        assert rv.headers['Content-Type'] == b'application/json; charset=utf-8'
        assert rv.headers['Content-Security-Policy'] == b"default-src 'none'"
        assert rv.headers['Strict-Transport-Security'] == b'max-age=31536000; includeSubdomains; preload'
        assert rv.headers['X-Content-Type-Options'] == b'nosniff'
        assert rv.headers['X-Frame-Options'] == b'deny'
        assert rv.headers['X-XSS-Protection'] == b'1; mode=block'
