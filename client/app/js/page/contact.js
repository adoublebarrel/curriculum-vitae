define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var ContactUi = require('component/contact-ui'),
      Nav = require('component/navbar-ui');

  /**
   * Module exports
   */

  return initialize;

  /**
   * Module function
   */
  function initialize() {
    Nav.attachTo('nav', {
      buttonSelector: '.navbar-toggle',
      navbarSelector: '#navbar-collapse-1',
      toggleClass: 'collapse'      
    });

    ContactUi.attachTo('form', {
      nameSelector:             '#name',
      emailSelector:            '#email',
      messageSelector:          '#message',
      recaptchaSelector:        '#recaptcha',
      recaptchaBorderSelector:  '.g-recaptcha > div > div',
      submitSelector:           '#send',
      glyphiconSelector:        '.glyphicon',
      screenReaderSelector:     '.sr-only'    
    });
  }

});
