"use strict";

describeComponent('component/skillsModal-data', function() {
	beforeEach(function() {
		this.setupComponent(window.__html__['test/fixtures/skillsModal/modal.html'], {
			listenFor: 'viewSkill',
			successEvent: 'gotSkill',
			timeoutEvent: 'skillTimeout',
			errorEvent: 'skillError',
			missingEvent: 'skillMissing'
		});
		jasmine.Ajax.install();
	});

	afterEach(function() {
		jasmine.Ajax.uninstall();
	});

	it("makes an ajax request when the viewSkill event is received", function() {
		this.component.trigger('viewSkill', { url: '/skills/abc-defg'});
		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/skills/abc-defg');
	});

	it("triggers the successEvent with the json data when the ajax request succeeds", function() {
		var successJson = {"wont": "sample", "name": "Test", "will": "sample.", "hiatus": null, "name_lower": "apache httpd", "months": 168, "complement": [""], "description": "<p>A short description</p>"};

		jasmine.Ajax.stubRequest('/skills/abc-defg').andReturn({
			"status": 200,
			"content-type": "applicaton/json; charset=utf-8",
			"responseText": '{"wont": "sample", "name": "Test", "will": "sample.", "hiatus": null, "name_lower": "apache httpd", "months": 168, "complement": [""], "description": "<p>A short description</p>"}'
		});

		spyOnEvent(document, this.component.attr.successEvent);
		this.component.trigger('viewSkill', { url: '/skills/abc-defg'});
		expect(this.component.attr.successEvent).toHaveBeenTriggeredOnAndWith(document, successJson);
	});

	it("triggers missingEvent when the ajax status is 404", function() {
		jasmine.Ajax.stubRequest('/skills/abc-defg').andReturn({
			"status": 404
		});

		spyOnEvent(document, this.component.attr.missingEvent);
		this.component.trigger('viewSkill', {url: '/skills/abc-defg'});
		expect(this.component.attr.missingEvent).toHaveBeenTriggeredOn(document);
	});

	it("triggers errorEvent when ajax request fails and status is not 404", function() {
		jasmine.Ajax.stubRequest('/skills/abc-defg').andReturn({
			status: 500
		});

		spyOnEvent(document, this.component.attr.errorEvent);
		this.component.trigger('viewSkill', {url: '/skills/abc-defg'});
		expect(this.component.attr.errorEvent).toHaveBeenTriggeredOn(document);
	});

	it("triggers timeoutEvent when the ajax request times out", function() {
		jasmine.clock().install();
		$.ajaxSetup({
			timeout: 5000
		});

		spyOnEvent(document, this.component.attr.timeoutEvent);

		this.component.trigger('viewSkill', {url: '/skills/abc-defg'});
		jasmine.clock().tick(5001);
		expect(this.component.attr.timeoutEvent).toHaveBeenTriggeredOn(document);

		jasmine.clock().uninstall();
		$.ajaxSetup({
			timeout: 0
		});		
	});
});