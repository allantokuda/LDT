'use strict';

/* Directives */

var app = angular.module('myApp.directives', [])

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
  }
});


app.directive('autoFocus',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var regex = /([.#-\w\d]+) on ([\w]+)/
      var matches = regex.exec(iAttrs.autoFocus);
      var params = _.object(['targetSelector', 'eventName'], matches.slice(1,3));

      element.bind(params.eventName, function(e) {
        // Select the whole entity title for fast rename
        $(element.find(params.targetSelector)[0]).select();
      })
    }
  }
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
            scope[iAttrs.moveWith].x = parseInt(element.css('left'));
            scope[iAttrs.moveWith].y = parseInt(element.css('top'));
          });
        },
      });
    }
  }
});

// Setup entities to be draggable and bind their position to the scope
app.directive('resizeWith',function() {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      element.resizable({
        resize: function() {
          scope.$apply(function read() {
            scope[iAttrs.moveWith].width = parseInt(element.css('width'));
            scope[iAttrs.moveWith].height = parseInt(element.css('height'));
          });
        },
      });
    }
  }
});


// Setup entities to be draggable and resizable, and bind to the scope
app.directive('selectWith',function() {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      var regex = /([\w\d]+) as ([\w\d]+)(?: in ([.#-\w\d]+))?/
      var matches = regex.exec(iAttrs.selectWith);
      var params = _.object(['eventName', 'varName', 'parentID'], matches.slice(1,4));

      //Define variable if not externally defined
      if (typeof(scope[params.varName]) == 'undefined')
        scope[params.varName] = {};

      var scopeVar = scope[params.varName];
      scopeVar.selected = false;

      //Setup class to watch the scope
      scope.$watch(params.varName + '.selected', function(selected) {
        if (scopeVar.selected)
          element.addClass('selected');
        else
          element.removeClass('selected');
      });

      element.bind(params.eventName, function(e) {
        // Deselect all other selectables first
        element.parents(params.parentID).trigger('click');

        scope.$apply( function() { scopeVar.selected = true });

        // Don't allow parent to get the click again
        e.stopPropagation();
      });

      element.parents(params.parentID).click(function(e) {
        scope.$apply( function() { scopeVar.selected = false });
      });
    }
  }
});


app.directive('action',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      element.click(function(e) {
        var actionName = element[0].innerText.replace(' ', '').replace(/^(.)/, function(c) { return c.toLowerCase() });
        scope[actionName + 'Command']();
      })
    }
  }
});

app.directive('hotkey',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      $(window).keypress(function(e) {
        if (e.charCode == iAttrs.hotkey.charCodeAt(0))
          element.trigger('click')
      });
      element.attr('title', 'hotkey: ' + iAttrs.hotkey)
    }
  }
});
