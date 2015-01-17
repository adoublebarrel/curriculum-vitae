"use strict";

describeComponent('component/table-ui', function() {
	beforeEach(function() {
		this.setupComponent(window.__html__['test/fixtures/table-ui/table.html'], {
			dataEvent: 'getData'
		});
	});

	it("triggers a data request with a url when a name field is clicked", function() {
		spyOnEvent(document, 'getData');
		$('a')[2].click();
		expect('getData').toHaveBeenTriggeredOnAndWith(document,{url: '/skills/abc-defg'});
	});	
});