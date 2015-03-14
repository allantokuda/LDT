'use strict';

angular.module('LDT.ui').directive('stickToMouse',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      function follow(e) {
        var scale = element[0].offsetWidth / element[0].getBoundingClientRect().width;

        element.css('left', e.pageX * scale - element[0].parentElement.offsetLeft);
        element.css('top',  e.pageY * scale - element[0].parentElement.offsetTop);
      }
      $(document).mousemove(follow);
    }
  };
});
