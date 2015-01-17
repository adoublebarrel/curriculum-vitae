"use strict";

define(
	['flight/lib/component'],

	function (defineComponent) {
		return defineComponent(navbarUi);

		function navbarUi() {
			this.attributes({
				buttonSelector: null,
				navbarSelector: null,
				toggleClass: null
			});

			this.toggleCollapse = function(ev, data) {
				this.select('navbarSelector').toggleClass(this.attr.toggleClass);
			}

			this.after('initialize', function(){
				this.on('click', {
					buttonSelector: this.toggleCollapse
				})
			});
		}
	}
);