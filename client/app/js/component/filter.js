"use strict";

define(
	['flight/lib/component'],

	function(defineComponent) {
		return(defineComponent(filter));

		function filter() {

			this.attributes({
				filterFieldSelector: null,
				filterEvent: 'updateFilter',
				hideSelector: null,
				hideClass: 'hidden'
			});

			this.filter = function(ev, data) {
				var records = this.select('filterFieldSelector'),
					containers = this.select('hideSelector'),
					filters = [],
					hide,
					current;

				filters = data.filter.toLowerCase().replace(/\s/g,'').split(',');

				for (var i = records.length - 1; i >= 0; i--) {
					current = records[i].textContent.toLowerCase().replace(/\s/g,'');
					hide = true;
					for (var j = filters.length - 1; j >= 0; j--) {
						if (filters[j][0] === "'" && filters[j][(filters[j].length-1)] === "'") {
							if (hide === true && current !== filters[j].replace(/'/g,"")) {
								containers.eq(i).addClass(this.attr.hideClass);
							} else {
								hide = false;
							}

						} else if (hide === true && current.indexOf(filters[j]) !== 0) {
							containers.eq(i).addClass(this.attr.hideClass);
						} else {
							hide = false;
							containers.eq(i).removeClass(this.attr.hideClass);
						}
					};
				};
			}

			this.after('initialize', function() {
				this.on(document, 'updateFilter', this.filter);
			});
		}
	}
);