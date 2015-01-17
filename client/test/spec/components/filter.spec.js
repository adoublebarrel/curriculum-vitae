"use strict";

describeComponent('component/filter', function () {
	beforeEach(function() {
		this.setupComponent(window.__html__['test/fixtures/filter/filter-contents.html'], {
			filterFieldSelector: 'tr > td:first-child',
			filterEvent: 'updateFilter',
			hideSelector: 'tbody > tr',
			hideClass: 'hidden'
		});		
	});

	it("hides elements whose values don't match the filter", function() {
		this.component.trigger('updateFilter', { filter: 'p' });
		expect(this.component.$node.find('.hidden').length).toEqual(1);
		expect(this.component.$node.find('#two')).toHaveClass('hidden');

	});

	it("unhides elements whose values do match the filter", function() {
		this.component.$node.find('#three').addClass('hidden');
		this.component.trigger('updateFilter', { filter: 'py' });

		expect(this.component.$node.find('.hidden').length).toEqual(3);
		expect(this.component.$node.find('#three')).not.toHaveClass('hidden');

	});

	it("applies seperate filters for ',' seperated strings", function() {
		this.component.trigger('updateFilter', { filter: 'php,apache' });
		expect(this.component.$node.find('.hidden').length).toEqual(1);
		expect(this.component.$node.find('#three')).toHaveClass('hidden');
	});

	it("ignores white space in the ',' seperated strings", function() {
		this.component.trigger('updateFilter', { filter: 'php, apache, python' });
		expect(this.component.$node.find('.hidden').length).toEqual(0);
	});

	it("matches strings in single quotes exactly", function() {
		this.component.trigger('updateFilter', { filter: "python,'php'"});

		expect($('.hidden').length).toEqual(2);
		expect($('#one')).not.toHaveClass('hidden');
	});
});