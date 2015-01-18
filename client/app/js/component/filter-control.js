"use strict";

define(
	['flight/lib/component'],

	function (defineComponent) {
		return defineComponent(filterControl);

		function filterControl() {

			this.attributes({
				controlsSelector: '#filter-control',
				textInputSelector: '#filter-text-input',
				filterNameSelector: '#filter-name',
				dropdownSelector:'#filter-dropdown',
				okSelector: '#filter-ok',
				clearSelector: '#filter-clear',
				hideClass: 'hidden',
				trigger: 'updateFilter'
			});

			this.showControls = function(ev, data) {
				this.select('filterNameSelector').addClass(this.attr.hideClass);
				this.select('controlsSelector').removeClass(this.attr.hideClass);
				this.select('dropdownSelector').addClass('open');
			}

			this.hideControls = function(ev,data) {

				this.select('controlsSelector').addClass(this.attr.hideClass);
				this.select('filterNameSelector').removeClass(this.attr.hideClass);
				this.closeDropdown();
			}

			this.closeDropdown = function(ev,data) {
				this.select('dropdownSelector').removeClass('open');

			}

			this.triggerUpdate = function(ev, data) {

				if (ev.keyCode == 13) {
					this.updateName();

					return;
				}



				this.trigger(this.attr.trigger, { filter: this.select('textInputSelector').val() });
			}

			this.captureClick = function(ev, data) {
				ev.stopPropagation();
			}

			this.clearTextInput = function(ev, datat) {
				this.select('textInputSelector').val('');
			}

			this.updateName = function(ev, data) {
				if (this.select('textInputSelector').val().length > 0) {
					this.trigger('newFilter', { name: 'Custom Filter'});
				} else  {
					this.trigger('newFilter',{});
				}

				this.hideControls();
			}

			this.after('initialize', function() {
				this.on('click', {
					filterNameSelector: this.showControls,
					okSelector: this.updateName,
					textInputSelector: this.closeDropdown,
					dropdownSelector: this.clearTextInput
				});

				this.on('focus', {
					textInputSelector: this.closeDropdown
				});

				this.on('keyup', {
					textInputSelector: this.triggerUpdate
				});

				this.on('newFilter', this.hideControls);
			});
		}

	}
);