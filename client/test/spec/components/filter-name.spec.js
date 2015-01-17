"use strict";

describeComponent('component/filter-name', function() {
	beforeEach(function () {
		this.setupComponent(window.__html__['test/fixtures/filter/name.html'], {
			filterNameSelector: '#filter-name',
			changeNameEvent: 'newFilter',
			suffix: '<span class="caret"></span>'
		});
	});

	it("changes the filter name to the value provided by the triggered event", function() {
		this.component.trigger('newFilter', { name: "my string"});

		expect($('#filter-name')).toHaveHtml('my string<span class="caret"></span>');
	});

	it("sets the filter name to 'All' if no name is provided by the event", function() {
		$('#filter-name').html('not All');

		this.component.trigger('newFilter', {});
		expect($('#filter-name')).toHaveHtml('All<span class="caret"></span>');		
	});
});