define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var Sort = require('component/sort'),
      Controls = require('component/controls'),
      FilterControls = require('component/filter-control'),
      Filter = require('component/filter'),
      FilterTags = require('component/filter-tags')
      DropdownFilters = require('component/filter-populate'),
      FilterName = require('component/filter-name'),
      ModalUI = require('component/skillsModal-ui'),
      ModalData = require('component/skillsModal-data'),
      TableUI = require('component/table-ui'),
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

    Sort.attachTo('#skills', {
      containerSelector: 'tbody',
      recordsSelector: 'tbody > tr'
    });

  Controls.attachTo('#sort-by-years', { 
      on: 'click',
      toggleSelector: '#sort-by-years > span',
      states: [
        {
          trigger: 'reorder',
          payload: { 
            rules: [
              {order: 'numDesc', selector: '.years'},
              {order: 'alphaAsc', selector: '.name'}        
            ]
          }
        },      
        {
          trigger: 'reorder',
          payload: {
            rules: [
              { order: 'numAsc', selector: '.years' },
              { order: 'alphaAsc', selector: '.name' }
            ]
          }
        }
      ] // end control states    
    });

    Controls.attachTo('#sort-by-name', {
      on: 'click',
      toggleSelector: '#sort-by-name > span',
      states: [
        {
          trigger: 'reorder',
          payload: {
            rules: [{order: 'alphaDesc', selector: '.name'}]
          }          

        },      
        {
          trigger: 'reorder',
          payload: {
            rules: [{order: 'alphaAsc', selector: '.name'}]
          }
        }
      ] // end control states
    });

    FilterControls.attachTo('.page-header', {
      controlsSelector: '#filter-controls',
      textInputSelector: '#custom-filter',
      filterNameSelector: '#filter-name',
      okSelector: '#filter-ok',
      clearSelector: '#filter-ok',
      trigger: 'updateFilter'      
    });
  
    Filter.attachTo('table', {
      filterFieldSelector: '.name',
      filterEvent: 'updateFilter',
      hideSelector: 'tbody > tr',
      hideClass: 'hidden'      
    });

    FilterTags.attachTo('table', {
      itemsSelector: 'tbody > tr',
      tagsDataAttribute: 'tags',
      hideClass: 'hidden',
      filterTrigger: 'filter-on-tags'
    });

    DropdownFilters.attachTo('#filter-dropdown', {
      changeFilterEvent: 'filter-on-tags',
      changeNameEvent: 'newFilter',
    });

    FilterName.attachTo('.page-header', {
      filterNameSelector: '#filter-name',
      changeNameEvent: 'newFilter',
      suffix: '<span class="caret"></span>'
    });

    ModalUI.attachTo('body');

    ModalData.attachTo(document, {
      successEvent: 'skill-data'
    });

    TableUI.attachTo('#skills', {
      dataEvent: 'viewSkill'
    });
  } // end initialaze

});

