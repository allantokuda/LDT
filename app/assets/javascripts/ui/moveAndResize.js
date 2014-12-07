'use strict';

// Setup a rectangular element to be movable and resizable, and bind its position to the scope
angular.module('LDT.ui').directive('moveAndResize', ['grid', function(grid) {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      var subject = scope[iAttrs.moveAndResize];
      var dragging = false;
      var dragType,
          dragStartX, dragStartY,
          dragStartMouseX, dragStartMouseY,
          dragStartWidth, dragStartHeight;

      var BORDER_HANDLE_SIZE = 10;

      // 0: move, 1: resize-left, 2: resize-right, 3: resize-top: 4: resize-bottom
      function boxBorderArea(x,y) {
               if (x < parseInt(element.offset().left) + BORDER_HANDLE_SIZE) {
          return 1;
        } else if (x > parseInt(element.offset().left) + parseInt(element.width()) - BORDER_HANDLE_SIZE) {
          return 2;
        } else if (y < parseInt(element.offset().top) + BORDER_HANDLE_SIZE) {
          return 3;
        } else if (y > parseInt(element.offset().top) + parseInt(element.height()) - BORDER_HANDLE_SIZE) {
          return 4;
        } else {
          return 0;
        }
      }

      function actionByDragType(ev) {
        switch(dragType) {
          case 0:
            subject.x      = grid.snap(dragStartX      + ev.pageX - dragStartMouseX);
            subject.y      = grid.snap(dragStartY      + ev.pageY - dragStartMouseY);
            break;
          case 1:
            subject.x      = grid.snap(dragStartX      + ev.pageX - dragStartMouseX);
            subject.width  = grid.snap(dragStartWidth  - ev.pageX + dragStartMouseX);
            break;
          case 2:
            subject.width  = grid.snap(dragStartWidth  + ev.pageX - dragStartMouseX);
            break;
          case 3:
            subject.y      = grid.snap(dragStartY      + ev.pageY - dragStartMouseY);
            subject.height = grid.snap(dragStartHeight - ev.pageY + dragStartMouseY);
            break;
          case 4:
            subject.height = grid.snap(dragStartHeight + ev.pageY - dragStartMouseY);
            break;
        }
      }

      function setCursor(ev) {
        switch(boxBorderArea(ev.pageX, ev.pageY)) {
          case 0: element.css('cursor', 'default' ); break;
          case 1: element.css('cursor', 'w-resize'); break;
          case 2: element.css('cursor', 'e-resize'); break;
          case 3: element.css('cursor', 'n-resize'); break;
          case 4: element.css('cursor', 's-resize'); break;
        }
      }

      function startDrag(ev) {
				// left click only (otherwise right click has issues)
				if (ev.button == 0) {
					dragging = true;
					dragStartX = subject.x;
					dragStartY = subject.y;
					dragStartWidth = subject.width;
					dragStartHeight = subject.height;
					dragStartMouseX = ev.pageX;
					dragStartMouseY = ev.pageY;
					dragType = boxBorderArea(ev.pageX, ev.pageY);
					ev.stopPropagation();
				}
      };

      function stopDrag(ev) {
        dragging = false;
      };

      function moveDrag(ev) {
        if (dragging) {
          scope.$apply(actionByDragType(ev));
        }
        // prevent highlighting action (annoying)
        ev.preventDefault();
        ev.stopPropagation();
      };

      $(element).mousedown(startDrag);
      $(document).mouseup(stopDrag);
      $(document).mouseleave(stopDrag);
      $(document).mousemove(moveDrag);
      $(element).mousemove(setCursor);
    }
  };
}]);
