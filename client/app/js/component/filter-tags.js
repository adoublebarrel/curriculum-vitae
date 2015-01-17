"use strict";

define(
	['flight/lib/component'],

	function (defineComponent) {
		return defineComponent(filterTags);

		function filterTags() {
			this.attributes({
				itemsSelector: null,
				tagsDataAttribute: null,
				hideClass: null,
				filterTrigger: null
			});

			this.filter = function(ev, data) {
				var items = this.select('itemsSelector'),
					anItem,
					anItemsTags;
				
				if (data.filter === 'All') {
					$(items).removeClass('hidden');
					return;
				}

				for (var i = items.length - 1; i >= 0; i--) {
					anItem = $(items[i]);
					anItemsTags = anItem.data(this.attr.tagsDataAttribute)
										.split(',');

					if (anItemsTags.indexOf(data.filter) > -1) {
						anItem.removeClass(this.attr.hideClass);
					} else {
						anItem.addClass(this.attr.hideClass);
					}					
				};
				
			}


			this.after('initialize', function() {
				this.on(document, this.attr.filterTrigger, this.filter);
			});
		}
	}
);