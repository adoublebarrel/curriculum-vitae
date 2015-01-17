"use strict";

define(
	['flight/lib/component'],

	function(defineComponent) {
		return defineComponent(tableUi);

		function tableUi () {
			this.attributes({
				dataEvent: null,
				nameSelector: '.name > a'
			});

			this.triggerData = function(ev, data) {
				this.trigger(this.attr.dataEvent, { url: ev.target.getAttribute('href')});
				ev.preventDefault();
			}

			this.after('initialize', function() {
				this.on('click', {
					nameSelector: this.triggerData
				});
			});
		}
	}
);