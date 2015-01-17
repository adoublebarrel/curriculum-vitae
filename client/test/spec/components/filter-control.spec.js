"use strict";

describeComponent('component/filter-control', function() {
	beforeEach(function() {
		this.setupComponent(window.__html__['test/fixtures/filter/filter-control.html'], {
			filterNameSelector: '#filter-name',
			controlsSelector: '#filter-controls',
			textInputSelector: '#custom-filter',
			dropdownSelector: '#filter-dropdown',
			okSelector: '#filter-ok',
			clearSelector: '#filter-clear',
			trigger: 'updateFilter'
		});
	});

	it("displays a set of controls when the current filter is clicked", function() {
		this.component.trigger(this.component.select('filterNameSelector'),'click');
		expect(this.component.select('controlsSelector')).not.toHaveClass('hidden');

	});

	it("opens the dropdown when it is displayed", function() {
		this.component.trigger(this.component.select('filterNameSelector'), 'click');
		expect(this.component.select('dropdownSelector')).toHaveClass('open');
	});

	it("hides the current filters name when it is clicked", function(){
		this.component.trigger(this.component.select('filterNameSelector'), 'click');
		expect(this.component.select('filterNameSelector')).toHaveClass('hidden');

	});

	it("transmits the text inputs contents after each key press", function() {
		this.component.trigger(this.component.select('filterNameSelector'), 'click');
		
		var textInput = this.component.select('textInputSelector');
		spyOnEvent(document, 'updateFilter');

		textInput.val('p');
		this.component.trigger(textInput, 'keyup');

		expect('updateFilter').toHaveBeenTriggeredOnAndWith(document, { filter: 'p'});
	});

	it("hides the filter controls if the enter/return key is struck", function() {
		var e = jQuery.Event("keyup"),
			textInput = this.component.select('textInputSelector');

		e.which = 13; //choose the one you want
		e.keyCode = 13;

		this.component.trigger(this.component.select('filterNameSelector'), 'click');
		textInput.trigger(e);

		expect(this.component.select('controlsSelector')).toHaveClass('hidden');

	});

	it("displays the filter name if the enter/return key is struck while the text input is active", function() {
		var e = jQuery.Event("keyup"),
			filterName = this.component.select('filterNameSelector');

		e.which = 13; //choose the one you want
		e.keyCode = 13;

		this.component.trigger(filterName, 'click');
		this.component.select('textInputSelector').trigger(e);

		expect(filterName).not.toHaveClass('hidden');
	});

	it("hides the filter controls if the 'ok' control is clicked", function() {
		this.component.trigger(this.component.select('filterNameSelector'), 'click');
		this.component.trigger(this.component.select('okSelector'), 'click');

		expect(this.component.select('controlsSelector')).toHaveClass('hidden');

	});

	it("displays the filter name if the 'ok' control is clicked", function() {
		this.component.trigger(this.component.select('filterNameSelector'), 'click');
		this.component.trigger(this.component.select('okSelector'), 'click');

		expect(this.component.select('filterNameSelector')).not.toHaveClass('hidden');
		
	});

	it("closes the dropdown when a newFilter event is triggered", function() {
		this.component.select('dropdownSelector').addClass('open');
		
		this.component.trigger('newFilter');

		expect(this.component.select('dropdownSelector')).not.toHaveClass('open');

	});

	it("triggers a filter name change to 'custom' when a filter is populated", function (){
		var e = jQuery.Event("keyup"),
			filterName = this.component.select('filterNameSelector'),
			textInput = this.component.select('textInputSelector');

		e.which = 13; //choose the one you want
		e.keyCode = 13;

		spyOnEvent(document,'newFilter');

		this.component.trigger(filterName, 'click');
		textInput.val('php');
		textInput.trigger(e);

		expect('newFilter').toHaveBeenTriggeredOnAndWith(document, {name: 'Custom Filter'});

	});

	it("triggers a empty filter name change if the filter is reset", function() {
		var e = jQuery.Event("keyup"),
			filterName = this.component.select('filterNameSelector'),
			textInput = this.component.select('textInputSelector');

		e.which = 13; //choose the one you want
		e.keyCode = 13;

		textInput.val('php');
		textInput.trigger(e);

		spyOnEvent(document,'newFilter');

		textInput.val('');
		textInput.trigger(e);
		
		expect('newFilter').toHaveBeenTriggeredOnAndWith(document, {});
	});

	it("closes the dropdown when the text input is clicked", function() {
		this.component.select('dropdownSelector').addClass('open');
		this.component.trigger(this.component.select('textInputSelector'), 'click');

		expect(this.component.select('dropdownSelector')).not.toHaveClass('open');
	});

	it("clears the text input if an item in the dropdown list is clicked", function() {
		var textInput = this.component.select('textInputSelector');
		
		textInput.val('php');

		this.component.select('dropdownSelector').find('li > a')[0].click();

		expect(textInput.val()).toEqual('');
	});
});