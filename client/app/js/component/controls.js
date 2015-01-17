'use strict';

define (

	['flight/lib/component'],

	function(defineComponent) {
		return defineComponent(controls);

		function controls() {

			this.attributes({
				i: 0,
				on: 'click',
				toggleSelector: false,
				filterSelector: false,
				states: null,
				conditions: {},
				triggerConditions: []
			});

			this.activate = function(ev, data) {
				var i = this.attr.i;

				this.toggleClass(i);

				do {
					if (data && data.hasOwnProperty('setState')) {
						i = data.setState;
						delete(data.setState);
					} else {

						i++;
					}

					if (this.attr.states.length == i) {
						i = 0;
					}
				} while(
					this.attr.states[i].hasOwnProperty('condition')
					&& this.attr.conditions[this.attr.states[i].condition] == false
				);

				if (this.attr.states[i].hasOwnProperty('payload')) {
					this.trigger(this.attr.states[i].trigger, this.attr.states[i].payload);
				} else {
					this.trigger(this.attr.states[i].trigger);
				}

				if (this.attr.states.length > 1) {

					this.toggleClass(i);
				}

				this.attr.i = i;
			}

			this.toggleClass = function(i) {
				if (this.attr.states[i].hasOwnProperty('class')) {

					if (this.attr.toggleSelector) {
						this.select('toggleSelector').toggleClass(this.attr.states[i].class);

					} else {
						this.$node.toggleClass(this.attr.states[i].class)
						
					}
				}
			}

			this.toggleCondition = function(triggerCondition) {
				return function() {
					this.attr.conditions[triggerCondition.condition] = triggerCondition.value;

					if (triggerCondition.hasOwnProperty('setState')) {
						this.activate({}, triggerCondition);
					}
				}
			}

			this.after('initialize', function () {
				if (this.attr.filterSelector) {
					this.on(this.attr.filterSelector, this.attr.on, this.activate);
					
				} else {
					this.on(this.attr.on, this.activate);
				}

				for (var i = this.attr.triggerConditions.length - 1; i >= 0; i--) {
					if (this.attr.triggerConditions[i].hasOwnProperty('filterSelector')) {
						this.on(this.attr.triggerConditions[i].filterSelector, this.attr.triggerConditions[i].event, this.toggleCondition(this.attr.triggerConditions[i]));
					} else {

						this.on(this.attr.triggerConditions[i].event, this.toggleCondition(this.attr.triggerConditions[i]));
					}
				};
			});
		}
	}
);