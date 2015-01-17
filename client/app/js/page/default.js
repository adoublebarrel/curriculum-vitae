define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var Nav = require('component/navbar-ui');

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
  }

});
