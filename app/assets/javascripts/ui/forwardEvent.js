'use strict';

// Would be nice to automatically highlight the attribute that was double-clicked.
/*
angular.module('LDT.ui').directive('forwardEvent',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var regex = /([\w]+) to ([.#-\w\d]+)/
      var matches = regex.exec(iAttrs.forwardEvent);
      var params = _.object(['eventName', 'targetSelector'], matches.slice(1,3));

      element.bind(params.eventName, function(e) {
        // Trigger another event on child when parent event occurs (danger... recursive event firing)
        console.log(e)
        var child = element.find(params.targetSelector)
        child.bind(params.eventName, function(e) { e.stopPropagation(); });
        child.trigger(e);
      })
    }
  }
});
*/

