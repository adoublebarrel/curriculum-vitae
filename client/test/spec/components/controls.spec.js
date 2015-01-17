'use strict';

describeComponent('component/controls', function() {

	it('should repeatedly trigger the event for a single state control', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'reorder',
				}
			]		
		});

		spyOnEvent(document, 'reorder');
		this.component.trigger(this.component.node, 'click');
		expect('reorder').toHaveBeenTriggeredOn(document);

		spyOnEvent(document, 'reorder');
		this.component.trigger(this.component.node, 'click');
		expect('reorder').toHaveBeenTriggeredOn(document);

	});

	it('should filter events using a selector', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/multiple_controls.html'], {
			on: 'click',
			filterSelector: '#control-one',
			states: [
				{
					trigger: 'reorder',
				}
			]	
		});

		spyOnEvent('#controls', 'reorder');
		this.component.trigger(this.component.select('filterSelector'), 'click');
		expect('reorder').toHaveBeenTriggeredOn('#controls');

		spyOnEvent('#controls', 'reorder');
		this.component.trigger(this.component.$node.find('#control-two'), 'click');
		expect('reorder').not.toHaveBeenTriggeredOn('#controls');		
	});

	it('should cycle through trigger events for controls with more than one state', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'up'
				},
				{
					trigger: 'down'
				}
			]		
		});

		spyOnEvent(document, 'down');
		this.component.trigger(this.component.node, 'click');
		expect('down').toHaveBeenTriggeredOn(document);

		spyOnEvent(document, 'up');
		this.component.trigger(this.component.node, 'click');
		expect('up').toHaveBeenTriggeredOn(document);		
	});

	it('should skip states that have falsy conditions', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'up',
					condition: 'sometimes'
				},
				{
					trigger: 'down'
				}
			],
			conditions: { sometimes: false }
		});

		spyOnEvent(document, 'down');
		this.component.trigger(this.component.node, 'click');
		expect('down').toHaveBeenTriggeredOn(document);

		spyOnEvent(document, 'down');
		spyOnEvent(document, 'up');
		this.component.trigger(this.component.node, 'click');
		expect('up').not.toHaveBeenTriggeredOn(document);
		expect('down').toHaveBeenTriggeredOn(document);
		
	});

	it('should enter states that have truthy conditions', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'up',
					condition: 'sometimes'
				},
				{
					trigger: 'down'
				}
			],
			conditions: { sometimes: true }
		});

		spyOnEvent(document, 'down');
		this.component.trigger(this.component.node, 'click');
		expect('down').toHaveBeenTriggeredOn(document);

		spyOnEvent(document, 'up');
		this.component.trigger(this.component.node, 'click');
		expect('up').toHaveBeenTriggeredOn(document);		
	});


	it('should assign conditions values for configured events', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'up',
					condition: 'sometimes'
				},
				{
					trigger: 'down'
				}
			],
			conditions: {sometimes: false},
			triggerConditions: [
				{ 
					event: 'myEvent',
					condition: 'sometimes',
					value: true
				}
			]
		});

		this.component.trigger(this.component.node, 'myEvent');
		expect(this.component.attr.conditions.sometimes).toBeTruthy();

	});

	it('should jump to a state when a binary condition is toggled', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'left'
				},
				{
					trigger: 'up'
				},
				{
					trigger: 'down'
				},
				{
					trigger: 'stop',
					condition: 'stopped'
				},
			],
			triggerConditions: [
				{
					event: 'myEvent',
					condition: 'stopped',
					value: true,
					setState: 3
				}
			]
		});

		spyOnEvent(document, 'stop');
		this.component.trigger(this.component.node, 'myEvent');
		expect('stop').toHaveBeenTriggeredOn(document);		

	});

	it('should filter triggerConditions via selectors', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/multiple_controls.html'], {
			on: 'click',
			states: [
				{
					trigger: 'reorder',
				}
			],
			conditions: { stopped: false},
			triggerConditions: [
				{
					filterSelector: '#control-one',
					event: 'myEvent',
					condition: 'stopped',
					value: true
				}
			]	
		});

		this.component.trigger('#control-two', 'myEvent');
		expect(this.component.attr.conditions.stopped).toBeFalsy();

		this.component.trigger('#control-one', 'myEvent');
		expect(this.component.attr.conditions.stopped).toBeTruthy();

	});

	it('should toggle a class on a control', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'bang',
					class: 'active'
				}
			]		
		});
		expect(this.component.$node.hasClass('active')).toBeFalsy();
		this.component.trigger(this.component.node, 'click');
		expect(this.component.$node.hasClass('active')).toBeTruthy();

		this.component.trigger(this.component.node, 'click');
		expect(this.component.$node.hasClass('active')).toBeFalsy();
	});


	it('should toggle a class on a child node of the control', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			toggleSelector: 'span',
			states: [
				{
					trigger: 'bang',
					class: 'active'
				}
			]		
		});

		expect(this.component.select('toggleSelector').hasClass('active')).toBeFalsy();

		this.component.trigger(this.component.node, 'click');
		expect(this.component.select('toggleSelector').hasClass('active')).toBeTruthy();

		this.component.trigger(this.component.node, 'click');
		expect(this.component.select('toggleSelector').hasClass('active')).toBeFalsy();		

	});

	it('should cycle through classes to toggle for controls with more than one state', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'bang',
					class: 'active'
				},
				{
					trigger: 'boom',
					class: 'very-active'
				}
			]		
		});

		// First state in the list is considered the starting state
		this.component.$node.toggleClass('active')
		expect(this.component.$node.hasClass('active')).toBeTruthy();
		expect(this.component.$node.hasClass('very-active')).toBeFalsy();

		this.component.trigger(this.component.node, 'click');
		expect(this.component.$node.hasClass('active')).toBeFalsy();
		expect(this.component.$node.hasClass('very-active')).toBeTruthy();

		this.component.trigger(this.component.node, 'click');
		expect(this.component.$node.hasClass('active')).toBeTruthy();		
		expect(this.component.$node.hasClass('very-active')).toBeFalsy();

	});

	it('should pass configured data when triggered', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'bang',
					payload: {attribute: 105}
				}
			]		
		});

		spyOnEvent(document, 'bang');
		this.component.trigger(this.component.node, 'click');
		expect('bang').toHaveBeenTriggeredOnAndWith(document, {attribute: 105});		

	});

	it('should pass different payloads for multi-state controls', function() {
		this.setupComponent(window.__html__['test/fixtures/controls/control.html'], {
			on: 'click',
			states: [
				{
					trigger: 'bang',
					payload: {attribute: 105}
				},
				{
					trigger: 'bing',
					payload: {attribute2: "string"}
				}
			]		
		});

		spyOnEvent(document, 'bing');
		this.component.trigger(this.component.node, 'click');
		expect('bing').toHaveBeenTriggeredOnAndWith(document, {attribute2: "string"});		

		spyOnEvent(document, 'bang');
		this.component.trigger(this.component.node, 'click');
		expect('bang').toHaveBeenTriggeredOnAndWith(document, {attribute: 105});		

	});

});