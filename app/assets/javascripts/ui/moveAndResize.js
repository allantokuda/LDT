'use strict';

// Setup a rectangular element to be movable and resizable, and bind its position to the scope
angular.module('LDT.ui').directive('moveAndResize', ['grid', function(grid) {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      var subject = eval('scope.' + iAttrs.moveAndResize);
      var dragging = false;
      var dragType, scale,
          dragStartX, dragStartY,
          dragStartMouseX, dragStartMouseY,
          dragStartWidth, dragStartHeight;

      var BORDER_HANDLE_SIZE = 7;

      // This determines which functional part of a box is at a particular coordinate
      // (either a click location or a hover location),
      // which enables the resize functionality near the borders.
      // 0: move, 1: resize-left, 2: resize-right, 3: resize-top: 4: resize-bottom
      function boxBorderArea(x,y) {
        var rect = element[0].getBoundingClientRect();

        if        (x < parseInt(rect.left  ) + BORDER_HANDLE_SIZE) {
          return 1;
        } else if (x > parseInt(rect.right ) - BORDER_HANDLE_SIZE) {
          return 2;
        } else if (y < parseInt(rect.top   ) + BORDER_HANDLE_SIZE) {
          return 3;
        } else if (y > parseInt(rect.bottom) - BORDER_HANDLE_SIZE) {
          return 4;
        } else {
          return 0;
        }
      }

      function actionByDragType(ev) {
        switch(dragType) {
          case 0:
            subject.x      = grid.snap(dragStartX      + ev.clientX * scale - dragStartMouseX);
            subject.y      = grid.snap(dragStartY      + ev.clientY * scale - dragStartMouseY);
            break;
          case 1:
            subject.x      = grid.snap(dragStartX      + ev.clientX * scale - dragStartMouseX);
            subject.width  = grid.snap(dragStartWidth  - ev.clientX * scale + dragStartMouseX);
            break;
          case 2:
            subject.width  = grid.snap(dragStartWidth  + ev.clientX * scale - dragStartMouseX);
            break;
          case 3:
            subject.y      = grid.snap(dragStartY      + ev.clientY * scale - dragStartMouseY);
            subject.height = grid.snap(dragStartHeight - ev.clientY * scale + dragStartMouseY);
            break;
          case 4:
            subject.height = grid.snap(dragStartHeight + ev.clientY * scale - dragStartMouseY);
            break;
        }
      }

      function setCursor(ev) {
        switch(boxBorderArea(ev.clientX, ev.clientY)) {
          case 0: element.css('cursor', 'default' ); break;
          case 1: element.css('cursor', 'w-resize'); break;
          case 2: element.css('cursor', 'e-resize'); break;
          case 3: element.css('cursor', 'n-resize'); break;
          case 4: element.css('cursor', 's-resize'); break;
        }
      }

      function startDrag(ev) {
				// left click only (otherwise right click has issues)
				if (ev.button === 0) {
          //account for current zoom scale
          scale = element[0].offsetWidth / element[0].getBoundingClientRect().width;

					dragging = true;
					dragStartX = subject.x;
					dragStartY = subject.y;
					dragStartWidth = subject.width;
					dragStartHeight = subject.height;
					dragStartMouseX = ev.clientX * scale;
					dragStartMouseY = ev.clientY * scale;
					dragType = boxBorderArea(ev.clientX, ev.clientY);

					ev.stopPropagation();
				}
      }

      function stopDrag(ev) {
        dragging = false;
      }

      function moveDrag(ev) {
        if (dragging) {
          scope.$apply(actionByDragType(ev));
        }
        // prevent highlighting action (annoying)
        ev.preventDefault();
        ev.stopPropagation();
      }

      $(element).mousedown(startDrag);
      $(document).mouseup(stopDrag);
      $(document).mouseleave(stopDrag);
      $(document).mousemove(moveDrag);
      $(element).mousemove(setCursor);
    }
  };
}]);
