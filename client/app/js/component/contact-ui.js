'use strict';

define(

	['flight/lib/component'],

	function(defineComponent) {
		return defineComponent(contactUi);

		function contactUi() {
			this.attributes({
				nameSelector: null,
				emailSelector: null,
				messageSelector: null,
				recaptchaSelector: null,
				recaptchaBorderSelector: null,
				submitSelector: null,
				recaptchaSuccessful: false,
				glyphiconSelector: null,
				screenReaderSelector: null
			});

			this.validate = function(ev, data) {

				if(this.attr.recaptchaSuccessful === false) {

					this.select('recaptchaSelector').removeClass('has-success')
													.addClass('has-error');

					this.select('recaptchaBorderSelector').css('border', '1px solid #a94442')
											  			  .css('border-radius', '4px');

					ev.preventDefault();
					return;
				}

				if (
					!this.isValidName(this.select('nameSelector').find(':input').val()) ||
					!this.isValidEmail(this.select('emailSelector').find(':input').val()) ||
					!this.isValidMessage(this.select('messageSelector').find(':input').val())
				) {
					ev.preventDefault();

				}
			}

			this.markGoodRecaptcha = function(ev, data) {
				this.attr.recaptchaSuccessful = true;
				this.select('recaptchaSelector').removeClass('has-error')
												.addClass('has-success');

				this.select('recaptchaBorderSelector').css('border', '1px solid #3c763d')
													  .css('border-radius', '4px');
			}

			this.updateName = function(ev, data) {
				var name = this.select('nameSelector'),
					glyphicon = name.find(this.attr.glyphiconSelector),
					screenReader = name.find(this.attr.screenReaderSelector);

				if (this.isValidName(name.find(':input').val())) {
					name.removeClass('has-error')
						.addClass('has-success');

					glyphicon.removeClass('glyphicon-remove')
							 .addClass('glyphicon-ok');

					screenReader.text('(ok)');

				} else {
					name.removeClass('has-success').addClass('has-error');

					glyphicon.removeClass('glyphicon-ok')
							 .addClass('glyphicon-remove');

					screenReader.text('(error)');
				}
			}

			this.updateEmail = function(ev, data) {
				var email = this.select('emailSelector'),
					glyphicon = email.find(this.attr.glyphiconSelector),
					screenReader = email.find(this.attr.screenReaderSelector);


				if (this.isValidEmail(email.find(':input').val())) {
					email.removeClass('has-error')
						 .addClass('has-success');

					glyphicon.removeClass('glyphicon-remove').addClass('glyphicon-ok');

					screenReader.text('(ok)');

				} else {
					email.removeClass('has-success')
						 .addClass('has-error');

					glyphicon.removeClass('glyphicon-ok')
							 .addClass('glyphicon-remove');

					screenReader.text('(error)');
				}
			}

			this.updateMessage = function(ev, data) {
				var message = this.select('messageSelector'),
					glyphicon = message.find(this.attr.glyphiconSelector),
					screenReader = message.find(this.attr.screenReaderSelector);

				if (this.isValidMessage(message.find(':input').val())) {
					message.removeClass('has-error')
						   .addClass('has-success');

					glyphicon.removeClass('glyphicon-remove')
							 .addClass('glyphicon-ok');

					screenReader.text('(ok)');
				} else {
					message.removeClass('has-success')
						   .addClass('has-error');

					glyphicon.removeClass('glyphicon-ok')
							 .addClass('glyphicon-remove');

					screenReader.text('(error)');
				}
			}

			this.isValidName = function(value) {
				if (this.isStringEmpty(value)) {
					return false;
				}

				return true;
			}

			this.isValidEmail = function(value) {
				if (value.search(/\S@\S/) !== -1) {
					return true;
				}

				return false;
			}

			this.isValidMessage = function(value) {
				if (this.isStringEmpty(value)) {
					return false;
				}

				return true;
			}

			this.isStringEmpty = function(s) {
				if (s.trim().length > 0) {
					return false;
				}

				return true;
			}

			this.after('initialize', function() {
				this.on('submit', this.validate);
				this.on(document, 'recaptcha-successful', this.markGoodRecaptcha);

				this.on('keyup', {
					'nameSelector': this.updateName,
					'emailSelector': this.updateEmail,
					'messageSelector': this.updateMessage
				});

				this.on('focusout', {
					'nameSelector': this.updateName,
					'emailSelector': this.updateEmail,
					'messageSelector': this.updateMessage
				});
			});
		}
	}
);