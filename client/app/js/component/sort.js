'use strict';

define(

	[ 'flight/lib/component'],

	function(defineComponent) {

		return defineComponent(sort);

		function sort() {

			this.attributes({
				reorderEventSelector: 'reorder',
				containerSelector: '',
				recordsSelector: ''
			});

			this.reorderNode = function(ev, data) {
				// Think of this as re-ordering a set of records by a given field.
				// The records themselves sit in a container, a physical analogue 
				// is a filing cabinet. The DOM reality is an HTML node.

				var	records,
					rules;

				records = this.$node.find(this.attr.recordsSelector);
				rules = this.parseRules(data.rules);
				this.validateRules(records, rules);
				// Detach container from the DOM for performance
				records.detach();

				// Simple Bubble Sort will do as showing enough records
				// for sorting performance to be an issue probably means you
				// need to re-think the UX.

				records = this.bubbleSort(records, rules);

				// Update the DOM with the ordered records
				this.$node.find(this.attr.containerSelector).html(records);

				return(true);
			}

			this.compareAlphaAsc = function(recordA, recordB) {
				if (recordA.toLowerCase() < recordB.toLowerCase()) {
					return true;
				}

				return false;
			}

			this.compareAlphaDesc = function(recordA, recordB) {
				if (recordA.toLowerCase() > recordB.toLowerCase()) {
					return true;
				}

				return false;
			}

			this.compareNumAsc = function(recordA, recordB) {
				if (Number(recordA) < Number(recordB)) {
					return true;
				}

				return false;
			}

			this.compareNumDesc = function(recordA, recordB) {
				if (Number(recordA) > Number(recordB)) {
					return true;
				}

				return false;
			}

			this.parseRules = function(rules) {
				var compareFunc,
					parsedRules = [];

				for (var i = rules.length - 1; i >= 0; i--) {

					switch (rules[i].order) {
						case "alphaAsc":
							compareFunc = this.compareAlphaAsc;
							break;
						case "alphaDesc":
							compareFunc = this.compareAlphaDesc;
							break;
						case "numAsc":
							compareFunc = this.compareNumAsc;
							break;
						case "numDesc":
							compareFunc = this.compareNumDesc;
							break;
						default:
							throw {
								name: 'InvalidOrderConfig',
								message: 'The string "' + rules[i].order + '" is not a valid order. Valid options are alphaAsc, alphaDesc, numAsc or numDesc.'
							};
					}

					parsedRules.push(
						{ compareFunc: compareFunc, selector: rules[i].selector}
					);
				};

				return parsedRules;
			}

			this.validateRules = function(records, rules) {
				var numRecords 	= records.length,
					numRules 	=  rules.length;

				for (var i = numRules - 1; i >= 0; i--) {
					if (numRecords !== records.find(rules[i].selector).length){
						throw {
							name: 'InvalidOrderConfig',
							message: "The selector '" + rules[i].selector + "' does not return matches for every record/item that is to be sorted (" + numRecords + ' records vs ' + records.find(rules[i].selector).length + ' matching fields)'
						};
					}
				};
			}

			this.bubbleSort = function(records, rules) {
				var before, after;


				// Cache the values we're sorting on. This avoids running
				// JQuery selectors repeatedly which scales poorly.
				if (!rules[0].hasOwnProperty('records')) {
					for (var i = rules.length - 1; i >= 0; i--) {
						rules[i].records = records.find(rules[i].selector).contents();
					}
				}
				
				for (var i = records.length - 1; i > 0; i--) {

					for (var j = rules.length - 1; j >= 0; j--) {

						if (rules[j].compareFunc(
							rules[j].records[i].textContent, 
							rules[j].records[i-1].textContent)
						){
							before = records[i];
							after = records[i-1];
							records[i] = after;
							records[i-1] = before;

							for (var k = rules.length - 1; k >= 0; k--) {
								before = rules[k].records[i];
								after  = rules[k].records[i-1];
								rules[k].records[i] = after;
								rules[k].records[i-1] = before;
							};


							// recurse
							records = this.bubbleSort(records, rules);

						}

						// Only apply the next ordering rule
						// if the values under the current rule are identical
						// e.g. sorting a population by age then name, we only
						// need to sort by name if two adjacent records ages
						// have the same value
						if (rules[j].records[i].textContent !== rules[j].records[i-1].textContent) {
							break;
						}

					}
				}

				return records;
			}

			this.after('initialize', function() {
				this.on('reorder', this.reorderNode )
			});


		}


	}

);