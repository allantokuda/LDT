'use strict';

//Calls scope with coordinates clicked in the current element,
//even if a child element with different coordinates caught the event.
angular.module('LDT.ui').directive('relativeClick',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var scopeFunctionName = iAttrs.relativeClick;

      $(element).click(function(ev) {
        scale = element[0].offsetWidth / element[0].getBoundingClientRect().width;

        var relativeX = ev.pageX * scale - $(element)[0].offsetLeft;
        var relativeY = ev.pageY * scale - $(element)[0].offsetTop;
        scope.$apply(function() {
          scope[scopeFunctionName](relativeX, relativeY);
        });
      });
    }
  };
});
