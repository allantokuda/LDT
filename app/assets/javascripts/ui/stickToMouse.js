'use strict';

angular.module('LDT.ui').directive('stickToMouse',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      function follow(e) {
        element.css('left', e.pageX - element[0].parentElement.offsetLeft);
        element.css('top',  e.pageY - element[0].parentElement.offsetTop);
      };
      $(document).mousemove(follow);
    }
  };
});
