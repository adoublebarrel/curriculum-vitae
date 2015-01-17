"use strict";

define(
	['flight/lib/component'],
	
	function (defineComponent) {
		return defineComponent(skillsModalData);

		function skillsModalData() {
			this.attributes({
				listenFor: 'viewSkill',
				successEvent: 'skillModal-got',
				timeoutEvent: 'skillModal-timeout',
				errorEvent: 'skillModal-error',
				missingEvent: 'skillModal-missing'
			});

			this.requestSkill = function(ev, data) {

				if (data.hasOwnProperty('url')) {
					$.getJSON(data.url)
						.done(this.success.bind(this))
						.fail(this.fail.bind(this));

				}
			}

			this.fail = function(jqXHR, textStatus, errorThrown) {
				if (jqXHR.status === 404) {
					this.trigger(this.attr.missingEvent);
					return;
				}

				if (errorThrown === 'timeout'){
					this.trigger(this.attr.timeoutEvent);
					return
				}

				this.trigger(this.attr.errorEvent);
			}

			this.success = function(data) {
				this.trigger(this.attr.successEvent, data);
			}

			this.after('initialize', function() {
				this.on(document, this.attr.listenFor, this.requestSkill);

			});
		}
	}
);