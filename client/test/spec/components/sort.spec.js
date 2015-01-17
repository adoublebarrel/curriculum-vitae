"use strict";

describeComponent('component/sort', function() {
    beforeEach(function() {
        this.setupComponent(window.__html__['test/fixtures/sort/tbody_sort.html'], {
            orderEventSelector: 'reorder',
            containerSelector: 'tbody',
            recordsSelector: 'tbody > tr'
        });
    });

    it("can sort alphabetical content in ascending order", function() {
        var result, expected;
        
        this.component.trigger('reorder', {
            rules: [{ order: 'alphaAsc', selector: 'td[data-type="Name"]'}],
        });

        result = this.component.$node.find('tbody > tr').text();
        expected = $(window.__html__['test/fixtures/sort/tbody_sorted_name_asc.html']).find('tr').text();

        expect(result).toEqual(expected);
    });

    it("can sort alphabetical content in descending order", function() {
        var result, expected;
        
        this.component.trigger('reorder', {
            rules: [{ order: 'alphaDesc', selector:'td[data-type="Name"]' }],
        });

        result = this.component.$node.find('tbody > tr').text();
        expected = $(window.__html__['test/fixtures/sort/tbody_sorted_name_desc.html']).find('tr').text();

        expect(result).toEqual(expected);
    });

    it("can sort numeric content in ascending order", function() {
        var result, expected;
        
        this.component.trigger('reorder', {
            rules: [
                { order: 'numAsc', selector: 'td[data-type="age"]'},
                { order: 'alphaAsc', selector: 'td[data-type="Name"]'}
            ],
        });

        result = this.component.$node.find('tbody > tr').text();
        expected = $(window.__html__['test/fixtures/sort/tbody_sorted_age_asc.html']).find('tr').text();

        expect(result).toEqual(expected);
    });

    it("throws an error if an order rules selector find as many fields as there are records", function() {
        var  expected = this.component.$node.clone(), thrown;

        try {
            this.component.trigger('reorder', {
                rules: [{order: 'alphaAsc', selector: 'wontMatch'}]
            });
        } catch(e) {
            thrown = true;
        }

        expect(thrown).toBeTruthy();
    });

    it("throws an error if an order rules order string is invalid", function() {
        var  expected = this.component.$node.clone(), thrown;

        try {
            this.component.trigger('reorder', {
                rules: [{order: 'badConfig', selector: 'td'}]
            });
        } catch(e) {
            thrown = true;
        }

        expect(thrown).toBeTruthy();
    });

}); 

