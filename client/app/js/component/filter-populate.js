"use strict";

define(
	['flight/lib/component'],

	function (defineComponent) {
		return defineComponent(filterPopulate);

		function filterPopulate () {
			this.attributes({
				buttonSelector: 'button',
				optionsSelector: '#filter-options',
				changeFilterEvent: 'updateFilter',
				changeNameEvent: 'newFilter'
			});

			this.populateFilter = function (ev, data) {
				this.trigger(this.attr.changeFilterEvent, {filter: ev.target.getAttribute('data-filter')});
				this.trigger(this.attr.changeNameEvent, { name: ev.target.textContent } );
				this.select('controlsSelector').addClass('hidden');
				this.select('filterNameSelector').removeClass('hidden');
			}

			this.toggle = function(ev,data) {
				this.$node.addClass('open');
			}

			this.after('initialize', function() {
				this.on('click', {
					optionsSelector: this.populateFilter,
					buttonSelector: this.toggle
				});
			});
		}
	}
);