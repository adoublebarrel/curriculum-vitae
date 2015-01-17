"use strict";

describeComponent('component/skillsModal-ui', function() {
	beforeEach(function() {
		this.setupComponent(window.__html__['test/fixtures/skillsModal/modal.html'], {
			modalSelector: '#skills-modal',
			backdropSelector: '.modal-backdrop',
			titleSelector: '#skill-name',
			descriptionSelector: '#skill-description',
			willSelector: '#skill-will',
			wontSelector: '#skill-wont',
			closeSelector: '#modal-close',
			displayEvent: 'display',
			dismissEvent: 'dismiss',
			dataEvent: 'data'
		});
	});

    describe('when the display event is received', function () {

		it("changes the display value of the style attribute to block", function() {
			this.component.trigger('display');
			expect(this.component.select('modalSelector')).toHaveAttr('style','display: block');
		});

		it("adds the 'in' class to the modal", function () {
			this.component.trigger('display');
			expect(this.component.select('modalSelector')).toHaveClass('in');
		});

		it("changes the aria-hidden attribute to false", function() {
			this.component.trigger('display');
			expect(this.component.select('modalSelector')).toHaveAttr('aria-hidden', 'false')
		});

		it("inserts a div with class 'modal-backdrop'", function() {
			this.component.trigger('display');
			expect($('.modal-backdrop').length).toEqual(1);
		});
    });

    describe('when the dismiss event is received', function() {
    	it("changes the display value of the style attribute to none", function() {
    		this.component.trigger('display');
    		this.component.trigger('dismiss');
    		expect(this.component.select('modalSelector')).toHaveAttr('style', 'display: none');
    	});

    	it("removes the 'in' class from the modal", function() {
    		this.component.trigger('display');
    		this.component.trigger('dismiss');
    		expect(this.component.select('modalSelector')).not.toHaveClass('in');
    	});

    	it("changes the aria-hidden attribute to true", function() {
    		this.component.trigger('display');
    		this.component.trigger('dismiss');
    		expect(this.component.select('modalSelector')).toHaveAttr('aria-hidden', 'true');
    	});

    	it("removes the div with class 'modal-backdrop'", function() {
    		this.component.trigger('display');
    		this.component.trigger('dismiss');
    		expect($('.modal-backdrop').length).toEqual(0);
    	});
    });

    describe('when the data event is received', function() {
    	it("populates the modal title with the name", function() {
    		this.component.trigger('data', { name: 'PHP'});
    		expect($('#skill-name')).toHaveText('PHP');
    	});

    	it("populates the modal body with the description", function() {
    		this.component.trigger('data', { description: '<p>Some descriptive text.</p>'});
    		expect('#skill-description').toHaveText('Some descriptive text.');
    	});

    	it("populates the 'You Will' heading", function() {
    		this.component.trigger('data', { will: "want this modal to work"});
    		expect($('#skill-will')).toHaveText('want this modal to work');
    	});

    	it("populates the 'You Wont' heading", function() {
    		this.component.trigger('data', { wont: "want this test to fail"});
    		expect($('#skill-wont')).toHaveText('want this test to fail');
    	});

    	it("calls displays the modal immediately after poupulation by calling its' own display function", function() {
    		spyOn(this.component, 'display');
    		this.component.trigger('data',{});
    		expect(this.component.display).toHaveBeenCalled();
    	});

    	it("hides all but the first paragraph of the description", function() {
    		var description;
    		this.component.trigger('data', { description: '<p>para1</p><p>para2</p><p>para3</p>'});
    		description = $('#skill-description > p');
    		expect(description[0]).not.toHaveClass('hidden');
    		expect(description[1]).toHaveClass('hidden');
    		expect(description[2]).toHaveClass('hidden');
    	});
    });

    describe("when the close button is clicked", function() {
    	it("triggers the dismissEvent", function() {
    		spyOnEvent(document, this.component.attr.dismissEvent);
    		this.component.select('closeSelector').click();
    		expect(this.component.attr.dismissEvent).toHaveBeenTriggeredOn(document);
    	})
    });
});