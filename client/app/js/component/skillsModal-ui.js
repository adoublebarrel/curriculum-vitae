"use strict";

define(
	['flight/lib/component'],

	function (defineComponent) {
		return defineComponent(skillsModal);

		function skillsModal() {
			this.attributes({
				modalSelector: '#skills-modal',
				backdropSelector: '.modal-backdrop',
				titleSelector: '#skill-name',
				descriptionSelector: '#skill-description',
				willSelector: '#skill-will',
				wontSelector: '#skill-wont',
				closeSelector: '#modal-close',
				displayEvent: 'skill-display',
				dismissEvent: 'skill-dismiss',
				dataEvent: 'skill-data',
				backdrop: $('<div class="modal-backdrop fade in" style="height: 984px;"></div>')
			});

			this.display = function(ev, data) {
				var modal = this.select('modalSelector');
				modal.attr('style', 'display: block');
				modal.addClass('in');
				modal.attr('aria-hidden', 'false');
				this.select('modalSelector').before(this.attr.backdrop);
			}

			this.hide = function(ev, data) {
				var modal = this.select('modalSelector');
				modal.attr('style', 'display: none');
				modal.removeClass('in');
				modal.attr('aria-hidden', 'true');
				this.select('backdropSelector').remove();
			}

			this.populate = function(ev, data) {
				var paragraphs, i;

				this.select('titleSelector').text(data.name);
				this.select('descriptionSelector').html(data.description);

				paragraphs = this.select('descriptionSelector').children();

				for (i = paragraphs.length - 1; i > 0; i--) {
					paragraphs[i].setAttribute('class','hidden');
				};

				this.select('willSelector').text(data.will);
				this.select('wontSelector').text(data.wont);
				this.display();
			}

			this.triggerDismiss = function(ev, data) {
				this.trigger(this.attr.dismissEvent);
			}

			this.after('initialize', function() {
				this.on(this.attr.displayEvent, this.display);
				this.on(this.attr.dismissEvent, this.hide);
				this.on(document, this.attr.dataEvent, this.populate);
				this.on('click', {
					closeSelector: this.triggerDismiss
				})
			});
		}
	}
);