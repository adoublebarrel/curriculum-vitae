"use strict";

describeComponent('component/contact-ui', function() {
	var selectors = 
		{
			nameSelector: 			'#name',
			emailSelector: 			'#email',
			messageSelector: 		'#message',
			recaptchaSelector: 		'#recaptcha',
			recaptchaBorderSelector: '.g-recaptcha > div > div',
			submitSelector: 		'#send',
			glyphiconSelector: 		'.glyphicon',
			screenReaderSelector: 	'.sr-only'
		}

	beforeEach(function() {

		this.setupComponent(window.__html__['test/fixtures/contact-ui/contact.html'], selectors);
	});

	describe('when the keyup event is captured', function() {

		describe('by the name container', function() {
			var name, nameInput;

			beforeEach(function() {
				name = $(selectors.nameSelector);

			});

			describe('and the input contains non-whitespace characters', function() {

				beforeEach(function() {
					nameInput = name.find(':input').val('A');
					nameInput.trigger('keyup');
				});


				it('removes the has-error class from the container', function() {

					expect(name).not.toHaveClass('has-error');
				});

				it('adds the has-success class to the container', function() {

					expect(name).toHaveClass('has-success');
				});

				it('removes the glyphicon-remove class from the glyphicon span', function() {

					expect(name.find(selectors.glyphiconSelector)).not.toHaveClass('glyphicon-remove');
				});

				it('adds the glyphicon-ok class to the glyphicon span', function() {
					
					expect(name.find(selectors.glyphiconSelector)).toHaveClass('glyphicon-ok');
				});

				it('overwrites the contents of the screen reader span with the text "(ok)"', function() {

					expect(name.find(selectors.screenReaderSelector).text()).toEqual('(ok)');
				});

			});

			describe('and the input does not contain any non-whitespace characters', function() {
				var glyphicon;

				beforeEach(function() {
					name = $(selectors.nameSelector);
					name.removeClass('has-error').addClass('has-success');

					glyphicon = name.find(selectors.glyphiconSelector)
									.removeClass('glyphicon-remove')
									.addClass('glyphicon-ok');

					name.find(selectors.screenReaderSelector).text('(ok)');

					name.trigger('keyup');					
				});

				it('removes the has-success class from the container', function() {

					expect(name).not.toHaveClass('has-success');
				});

				it('adds the has-error class to the container', function() {

					expect(name).toHaveClass('has-error');
				});

				it('removes the glyphicon-ok class from the glyphicon span', function() {

					expect(glyphicon).not.toHaveClass('glyphicon-ok');
				});

				it('adds the glyphicon-remove class to the glyphicon span', function() {

					expect(glyphicon).toHaveClass('glyphicon-remove');
				});

				it('overwrites the contents of the screen reader span with the text "(error)"', function() {

					expect(name.find(selectors.screenReaderSelector).text()).toEqual('(error)');
				});				
			});

		});
		
		// when the keyup event is captured
		describe('by the email container', function() {
			var email;

			beforeEach(function() {
				email = $(selectors.emailSelector);
			});

			describe('and the email input does not contain an @ adjoined by two non-whitespace characters', function() {
				var glyphicon;

				beforeEach(function() {
					email.removeClass('has-error')
						 .addClass('has-success');

					glyphicon = email.find(selectors.glyphiconSelector)
									.removeClass('glyphicon-remove')
									.addClass('glyphicon-ok');

					email.find(selectors.screenReaderSelector).text('(ok)');

					email.find(':input')
						 .trigger('keyup');
				});

				it('removes the has-success class from the container', function() {

					expect(email).not.toHaveClass('has-success');
				});

				it('adds the has-error class to the container', function() {

					expect(email).toHaveClass('has-error');
				});

				it('removes the glyphicon-ok class from the glyphicon span', function() {

					expect(glyphicon).not.toHaveClass('glyphicon-ok');
				});

				it('adds the glyphicon-remove class to the glyphicon span', function() {

					expect(glyphicon).toHaveClass('glyphicon-remove');
				});

				it('overwrites the contents of the screen reader span with the text "(error)"', function() {

					expect(email.find(selectors.screenReaderSelector).text()).toEqual('(error)');
				});	
				
			});

			describe('and the email input contains an @ adjoined by two non-whitespace characters', function() {
				beforeEach(function() {
					email.find(':input')
						 .val('a@b')
						 .trigger('keyup');
				});

				it('adds the has-success class', function() {

					expect(email).toHaveClass('has-success');
				});

				it('removes the has-error class', function() {

					expect(email).not.toHaveClass('has-error');
				});

				it('removes the glyphicon-remove class from the glyphicon span', function() {

					expect(email.find(selectors.glyphiconSelector)).not.toHaveClass('glyphicon-remove');
				});

				it('adds the glyphicon-ok class to the glyphicon span', function() {
					
					expect(email.find(selectors.glyphiconSelector)).toHaveClass('glyphicon-ok');
				});

				it('overwrites the contents of the screen reader span with the text "(ok)"', function() {

					expect(email.find(selectors.screenReaderSelector).text()).toEqual('(ok)');
				});

			});
		});

		// when the keyup event is captured
		describe('by the message container', function() {
			var message, messageInput;

			beforeEach(function() {
				message = $(selectors.messageSelector);
			});

			describe('and the input contains non-whitespace characters', function() {

				beforeEach(function() {
					messageInput = message.find(':input').val('A');
					messageInput.trigger('keyup');
				});


				it('removes the has-error class from the container', function() {

					expect(message).not.toHaveClass('has-error');
				});

				it('adds the has-success class to the container', function() {

					expect(message).toHaveClass('has-success');
				});

				it('removes the glyphicon-remove class from the glyphicon span', function() {

					expect(message.find(selectors.glyphiconSelector)).not.toHaveClass('glyphicon-remove');
				});

				it('adds the glyphicon-ok class to the glyphicon span', function() {
					
					expect(message.find(selectors.glyphiconSelector)).toHaveClass('glyphicon-ok');
				});

				it('overwrites the contents of the screen reader span with the text "(ok)"', function() {

					expect(message.find(selectors.screenReaderSelector).text()).toEqual('(ok)');
				});

			});

			describe('and the input does not contain any non-whitespace characters', function() {
				var glyphicon;

				beforeEach(function() {
					message = $(selectors.messageSelector);
					message.removeClass('has-error').addClass('has-success');

					glyphicon = message.find(selectors.glyphiconSelector)
									.removeClass('glyphicon-remove')
									.addClass('glyphicon-ok');

					message.find(selectors.screenReaderSelector).text('(ok)');

					message.trigger('keyup');					
				});

				it('removes the has-success class from the container', function() {

					expect(message).not.toHaveClass('has-success');
				});

				it('adds the has-error class to the container', function() {

					expect(message).toHaveClass('has-error');
				});

				it('removes the glyphicon-ok class from the glyphicon span', function() {

					expect(glyphicon).not.toHaveClass('glyphicon-ok');
				});

				it('adds the glyphicon-remove class to the glyphicon span', function() {

					expect(glyphicon).toHaveClass('glyphicon-remove');
				});

				it('overwrites the contents of the screen reader span with the text "(error)"', function() {

					expect(message.find(selectors.screenReaderSelector).text()).toEqual('(error)');
				});				
			});
		});
	}); // end 'when the keyup event is captured'

	describe('when the recaptcha-successful event is triggered on the document', function() {
		var recaptchaContainer, recaptchaBorder;

		beforeEach(function() {
			recaptchaContainer = $(selectors.recaptchaSelector);
			recaptchaBorder = $(selectors.recaptchaBorderSelector);

			$(document).trigger('recaptcha-successful');
		});

		it('removes the has-error class from the container', function() {

			expect(recaptchaContainer).not.toHaveClass('has-error');
		});

		it('adds the has-success class to the container', function() {

			expect(recaptchaContainer).toHaveClass('has-success');
		});

		it('changes the recapthas border colour to #3c763d', function() {

			expect(recaptchaBorder.css('border')).toEqual('1px solid rgb(60, 118, 61)');
		});

		it('ensures that border-radius is set to 4px', function() {

			expect(recaptchaBorder.css('border-radius')).toEqual('4px');
		})		
	});

	describe('validates the form when send is clicked', function() {
		beforeEach(function() {
			// Set valid values which can be selectively broken
			// for tests
			$(selectors.nameSelector).find(':input').val('N');
			$(selectors.emailSelector).find(':input').val('a@b');
			$(selectors.messageSelector).find(':input').val('M');

			$(document).trigger('recaptcha-successful');

			spyOnEvent($('form'), 'submit');

		});

		describe('and prevents submission if', function() {

			describe('the name input', function() {
				it('is empty', function() {
					$(selectors.nameSelector).find(':input').val('');
					$(selectors.submitSelector).click();

					expect('submit').toHaveBeenPreventedOn($('form'));
				});

				it('only contains whitespace', function() {
					$(selectors.nameSelector).find(':input').val("   \n");

					$(selectors.submitSelector).click();
					expect('submit').toHaveBeenPreventedOn($('form'));
				});
			});

			describe('the message input', function() {
				it('is empty', function() {
					$(selectors.messageSelector).find(':input').val('');
					$(selectors.submitSelector).click();

					expect('submit').toHaveBeenPreventedOn($('form'));
				});

				it('only contains whitespace', function() {
					$(selectors.messageSelector).find(':input').val("   \n");
					$(selectors.submitSelector).click();

					expect('submit').toHaveBeenPreventedOn($('form'));

				});
			});

			describe('the email input', function() {
				it('is missing the @ symbol', function() {
					$(selectors.emailSelector).find(':input').val('alexgmail.com');
					$(selectors.submitSelector).click();

					expect('submit').toHaveBeenPreventedOn($('form'));
				});

				it('has an @ symbol with no preceding non-whitespace characters', function() {
					$(selectors.emailSelector).find(':input').val('@g');
					$(selectors.submitSelector).click();

					expect('submit').toHaveBeenPreventedOn($('form'));
				});

				it('has an @ symbol with no proceeding non-whitespace characters', function() {
					$(selectors.emailSelector).find(':input').val('x@');
					$(selectors.submitSelector).click();

					expect('submit').toHaveBeenPreventedOn($('form'));
				});				
			});

			it('has not received a recaptcha-successful event', function() {
				this.component.attr.recaptchaSuccessful = false;
				$(selectors.submitSelector).click();

				expect('submit').toHaveBeenPreventedOn($('form'));
			});

		});

		describe('and if recaptcha-successful event has not been triggered', function() {
			var recaptchaContainer, recaptchaBorder;

			beforeEach(function() {
				this.component.attr.recaptchaSuccessful = false;
				recaptchaContainer = $(selectors.recaptchaSelector);
				recaptchaBorder = $(selectors.recaptchaBorderSelector);

				recaptchaContainer.removeClass('has-error')
								  .addClass('has-success');

				$(selectors.submitSelector).click();
			});

			it('removes the has-success class from the container', function() {
				
				expect(recaptchaContainer).not.toHaveClass('has-success');
			});

			it('adds the class has-error to the container', function() {

				expect(recaptchaContainer).toHaveClass('has-error');
			});

			it("adds a inline border style", function() {			

				expect(recaptchaBorder.css('border')).toEqual('1px solid rgb(169, 68, 66)');
			});

			it('ensures a border-radius of 4px is applied', function() {

				expect(recaptchaBorder.css('border-radius')).toEqual('4px');
			});
		});

		it('and allows form submission when all validation checks pass', function() {
			spyOnEvent(document, 'submit')
			$(document).on('submit', function(ev) { ev.preventDefault(); });
			$(selectors.submitSelector).click();

			expect('submit').toHaveBeenPreventedOn(document);	
		});

	}); // end 'validates the form when send is clicked'

});