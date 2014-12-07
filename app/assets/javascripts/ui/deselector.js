'use strict';

angular.module('LDT.ui').directive('deselector',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      element.click(function(e) {
        scope.$broadcast('deselectAll');
      });
    }
  };
});

