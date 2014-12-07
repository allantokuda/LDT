'use strict';

angular.module('LDT.ui').directive('action',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      element.click(function(e) {
        var actionName = element[0].textContent.replace(' ', '').replace(/^(.)/, function(c) { return c.toLowerCase(); });
        scope[actionName + 'Command']();
      });
    }
  };
});

