'use strict';

angular.module('LDT.ui').directive('catchInput',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      function stopit(e) {
        e.stopPropagation();
      };

      //Don't allow clicks to change mode
      element.click(stopit);

      //Don't allow renaming keypresses to change mode
      element.keypress(stopit);
    }
  };
});

