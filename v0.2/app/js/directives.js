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


/*
app.directive('entitySection',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      element.bind('dblclick', function() {
        scope.$apply( function() {
          scope.renaming = !scope.renaming;
        });

        // Select the whole entity title for fast rename
        $(element.find("input")[0]).select();
      })
      element.keypress(function(e) {
        // scope.$apply seemed to be relevant here: http://stackoverflow.com/questions/14477904/how-to-create-on-change-directive-for-angularjs
        scope.$apply(function() {
          if (e.charCode == 13) {
            scope.renaming = false;
          }
        });
      });

      element.closest('#canvas').click(function() {
        scope.renaming = false;
      });
    }
  }
});

*/
