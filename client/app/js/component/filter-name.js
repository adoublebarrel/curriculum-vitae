"use strict";

define(
	['flight/lib/component'],

	function (defineComponent) {
		return defineComponent(filterName);

		function filterName() {

			this.attributes({
				filterNameSelector: '#filter-name',
				changeNameEvent: 'newFilter',
				suffix: ''
			});

			this.changeName = function (ev, data) {
				if (data.hasOwnProperty('name')) {
					this.select('filterNameSelector').html(data.name + this.attr.suffix);
					
				} else {
					this.select('filterNameSelector').html('All' + this.attr.suffix);
				}
			}

			this.after('initialize', function() {
				this.on(this.attr.changeNameEvent, this.changeName)
			});
		}
	}
);