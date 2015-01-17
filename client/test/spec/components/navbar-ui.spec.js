"use strict";

describeComponent('component/navbar-ui', function() {
	beforeEach(function() {
		this.setupComponent(window.__html__['test/fixtures/navbar-ui/nav.html'], {
			buttonSelector: '.navbar-toggle',
			navbarSelector: '#navbar-collapse-1',
			toggleClass: 'collapse'
		});
	});

	describe("when the nav button is clicked", function() {
		it("removes the toggleClass if it is present", function() {
			this.component.select('buttonSelector').click();
			expect(this.component.select('navbarSelector')).not.toHaveClass('collapse');
		});

		it("adds the toggleClass if it isn't present", function() {
			this.component.select('buttonSelector').click().click();
			expect(this.component.select('navbarSelector')).toHaveClass('collapse');
		});

	});
})