'use strict';

var app = angular.module('LDT.directives');

app.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

app.directive('catchInput',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      //Don't allow clicks to change mode
      element.click(function(e) {
        e.stopPropagation();
      });
      //Don't allow renaming keypresses to change mode
      element.keypress(function(e) {
        e.stopPropagation();
      });
    }
  };
});


app.directive('autoFocus',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var regex = /([-.#\w\d]+) on ([\w]+)/;
      var matches = regex.exec(iAttrs.autoFocus);
      var params = _.object(['targetSelector', 'eventName'], matches.slice(1,3));

      element.bind(params.eventName, function(e) {
        // Select the whole entity title for fast rename
        $(element.find(params.targetSelector)[0]).select();
      });
    }
  };
});


// Would be nice to automatically highlight the attribute that was double-clicked.
/*
app.directive('forwardEvent',function() {
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

// Setup entities to be draggable and bind their position to the scope
app.directive('moveAndResize',function() {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      var subject = scope[iAttrs.moveAndResize];
      var dragging = false;
      var dragType,
          dragStartX, dragStartY,
          dragStartMouseX, dragStartMouseY,
          dragStartWidth, dragStartHeight;

      var TOLERANCE = 10;

      // 0: move, 1: resize-left, 2: resize-right, 3: resize-top: 4: resize-bottom
      function setDragType(ev) {
               if (dragStartMouseX < parseInt(element.offset().left) + TOLERANCE) {
          dragType = 1;
        } else if (dragStartMouseX > parseInt(element.offset().left) + parseInt(element.width()) - TOLERANCE) {
          dragType = 2;
        } else if (dragStartMouseY < parseInt(element.offset().top) + TOLERANCE) {
          dragType = 3;
        } else if (dragStartMouseY > parseInt(element.offset().top) + parseInt(element.height()) - TOLERANCE) {
          dragType = 4;
        } else {
          dragType = 0;
        }
      }

      function actionByDragType(ev) {
        switch(dragType) {
          case 0:
            subject.x = dragStartX + ev.pageX - dragStartMouseX;
            subject.y = dragStartY + ev.pageY - dragStartMouseY;
            break;
          case 1:
            subject.x      = dragStartX      + ev.pageX - dragStartMouseX;
            subject.width  = dragStartWidth  - ev.pageX + dragStartMouseX;
            break;
          case 2:
            subject.width  = dragStartWidth  + ev.pageX - dragStartMouseX;
            break;
          case 3:
            subject.y      = dragStartY      + ev.pageY - dragStartMouseY;
            subject.height = dragStartHeight - ev.pageY + dragStartMouseY;
            break;
          case 4:
            subject.height = dragStartHeight + ev.pageY - dragStartMouseY;
            break;
        }
      }

      function startDrag(ev) {
        dragging = true;
        dragStartX = subject.x;
        dragStartY = subject.y;
        dragStartWidth = subject.width;
        dragStartHeight = subject.height;
        dragStartMouseX = ev.pageX;
        dragStartMouseY = ev.pageY;
        setDragType();
        ev.stopPropagation();
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
      };

      $(element).mousedown(startDrag);
      $(document).mouseup(stopDrag);
      $(document).mouseleave(stopDrag);
      $(document).mousemove(moveDrag);
    }
  };
});

// Setup entities to be draggable and bind their position to the scope
app.directive('resizeWith',function() {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      element.resizable({
        resize: function() {
          scope.$apply(function read() {
            scope[iAttrs.moveWith].width = parseInt(element.css('width'),10);
            scope[iAttrs.moveWith].height = parseInt(element.css('height'),10);
          });
        }
      });
    }
  };
});


// Setup entities to be draggable and resizable, and bind to the scope
app.directive('selectWith',function() {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      var regex = /([\w\d]+) as ([\w\d]+)/;
      var matches = regex.exec(iAttrs.selectWith);
      var params = _.object(['eventName', 'varName'], matches.slice(1,3));

      // Don't allow parent to get the click again
      element.click(function(e) { e.stopPropagation(); });

      //Define variable if not externally defined
      if (typeof(scope[params.varName]) == 'undefined')
        scope[params.varName] = {};

      var scopeVar = scope[params.varName];
      scopeVar.selected = false;

      //Setup class to watch the scope
      scope.$watch(params.varName + '.selected', function(selected) {
        var stopListening;

        if (scopeVar.selected) {
          element.addClass('selected');

          stopListening = scope.$on('deselectAll', function() {
            scope.$apply( function() { scopeVar.selected = false; });
          });

        } else {
          element.removeClass('selected');
          if (stopListening !== undefined) stopListening();
        }
      });

      //Set true when activated by specified event (and start listening for 'deselectAll');
      //set false when 'deselectAll' is broadcast (and stop listening for 'deselectAll').
      element.bind(params.eventName, function(e) {
        scope.$apply( function() { scopeVar.selected = true; });

        e.stopPropagation();
      });
    }
  };
});

app.directive('deselector',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      element.click(function(e) {
        scope.$broadcast('deselectAll');
      });
    }
  };
});


app.directive('action',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      element.click(function(e) {
        var actionName = element[0].textContent.replace(' ', '').replace(/^(.)/, function(c) { return c.toLowerCase(); });
        scope[actionName + 'Command']();
      });
    }
  };
});

app.directive('hotkey',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var pattern = /(?:(.)-)?(.)/;
      var matches = pattern.exec(iAttrs.hotkey);
      var hotkey = _.object(['chord', 'letter'], matches.slice(1,3));

      $(window).keypress(function(e) {
        var pressedChord =
          (e.ctrlKey  ? 'c' : '') +
          (e.shiftKey ? 's' : '') +
          (e.altKey   ? 'a' : '') +
          (e.metaKey  ? 'm' : '');

        if ((pressedChord === ''  && hotkey.chord == undefined && e.charCode == hotkey.letter.charCodeAt(0)     ) ||
            (pressedChord == 'c'  && hotkey.chord == 'c'       && e.charCode == hotkey.letter.charCodeAt(0) - 96) )
           element.trigger('click');
        });
      element.attr('title', 'hotkey: ' + iAttrs.hotkey);
    }
  };
});

app.directive('stickToMouse',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      $(window).mousemove(function(e) {
        element.css('left', e.pageX - element[0].parentElement.offsetLeft);
        element.css('top',  e.pageY - element[0].parentElement.offsetTop);
      });
    }
  };
});

//Calls scope with coordinates clicked in the current element,
//even if a child element with different coordinates caught the event.
app.directive('relativeClick',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var scopeFunctionName = iAttrs.relativeClick;

      $(element).click(function(ev) {
        var relativeX = ev.pageX - $(element)[0].offsetLeft;
        var relativeY = ev.pageY - $(element)[0].offsetTop;
        scope.$apply(function() {
          scope[scopeFunctionName](relativeX, relativeY);
        });
      });
    }
  };
});


app.directive('drag',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var scopeFunctionName = iAttrs.drag;

      $(element).mousedown(function(ev) { scope.dragging = true;  });
      $(element).mouseup  (function(ev) { scope.dragging = false; });

      $(element).mousemove(function(ev) {
        if (scope.dragging) {
          scope.$apply(function() {
            scope[scopeFunctionName](ev);
          });
        }
      });
    }
  };
});
