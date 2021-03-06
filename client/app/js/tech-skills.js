'use strict';

require(['common'], function(common) {

  require(
    [
      'flight/lib/compose',
      'flight/lib/registry',
      'flight/lib/advice',
      'flight/lib/logger',
      'flight/lib/debug'
    ],

    function(compose, registry, advice, withLogging, debug) {
      // debug.enable(true);
      compose.mixin(registry, [advice.withAdvice]);


      require(['page/tech-skills'], function(initializeDefault) {
        initializeDefault();
      });
    }
  );
});
