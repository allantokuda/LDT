'use strict';

/* Directives */

var app = angular.module('myApp.directives', []);

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
app.directive('moveWith',function() {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      element.draggable({
        drag: function() {
          scope.$apply(function read() {
            scope[iAttrs.moveWith].x = parseInt(element.css('left'),10);
            scope[iAttrs.moveWith].y = parseInt(element.css('top'),10);
          });
        }
      });
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
      var regex = /([\w\d]+)/;
      var matches = regex.exec(iAttrs.selectWith);
      var params = _.object(['eventName'], matches.slice(1,2));

      // Don't allow parent to get the click again
      element.click(function(e) { e.stopPropagation(); });

      element.bind(params.eventName, function(e) {
        element.addClass('selected');

        var unsubscribe = scope.$on('deselectAll', function() {
          element.removeClass('selected');
          unsubscribe();
        });

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

app.directive('textSelectWith',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var scopeVar = iAttrs.textSelectWith + '.selected';

      scope.$watch(scopeVar, function(selected) {
        if (selected)
          element.select();
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
