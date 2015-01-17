"use strict";

describeComponent('component/filter-tags', function () {
	beforeEach(function() {
		this.setupComponent(window.__html__['test/fixtures/filter/filter-tags.html'], {
			itemsSelector: 'tbody > tr',
			tagsDataAttribute: 'tags',
			hideClass: 'hidden',
			filterTrigger: 'filter-on-tags'
		});
	});

	it("hides elements whose values don't match the filter", function() {
		$(document).trigger('filter-on-tags', { filter: 'Programming Language'});
		expect($('.hidden').length).toEqual(4);
		expect($('#one')).toHaveClass('hidden');
		expect($('#two')).toHaveClass('hidden');
		expect($('#five')).toHaveClass('hidden');
		expect($('#six')).toHaveClass('hidden');
	});

	it("shows all elements when it receives the special filter 'All'", function() {
		$('tbody' > 'tr').addClass('hidden');
		$(document).trigger('filter-on-tags', { filter: 'All' });
		expect($('.hidden').length).toEqual(0);
	});
});