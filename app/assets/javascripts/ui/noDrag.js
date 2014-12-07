'use strict';

//Don't allow dragging that begins on this element to cause anything else to move
angular.module('LDT.ui').directive('noDrag',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      function stopit(e) {
        e.stopPropagation();
      };
      element.mousemove(stopit);
      element.mousedown(stopit);
    }
  };
});

