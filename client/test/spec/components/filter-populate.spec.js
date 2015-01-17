"use strict";

describeComponent('component/filter-populate', function() {
	beforeEach(function () {
		this.setupComponent(window.__html__['test/fixtures/filter/populate.html'], {
			buttonSelector: 'button',
			optionsSelector: '#options',
			changeFilterEvent: 'updateFilter',
			changeNameEvent: 'newFilter'

		});
	});

	it('triggers a filter update event when a filter option is clicked', function () {
		spyOnEvent(document, 'updateFilter');

		this.component.trigger($('#options > li > a')[0], 'click');

		expect('updateFilter').toHaveBeenTriggeredOn(document, { filter: 'javascript,css,jquery'});
	});

	it('triggers a filter name change when a filter option is clicked', function () {

		spyOnEvent(document, 'newFilter');
		this.component.trigger($('#options > li > a')[0], 'click');

		expect('newFilter').toHaveBeenTriggeredOnAndWith(document, { name: 'Web Client'});

	});

	it('opens the dropdown when the button is clicked', function() {
		$('button').click();
		expect($('#filter-dropdown')).toHaveClass('open');
	});
});