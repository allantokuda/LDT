'use strict';

/* Directives */

var app = angular.module('myApp.directives', [])

app.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

// Setup entities to be draggable and resizable, and bind to the scope
app.directive('entity',function() {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      element.draggable({
        drag: function() {
          scope.$apply(function read() {
            scope.entity.x = parseInt(element.css('left'));
            scope.entity.y = parseInt(element.css('top'));
          });
        },
      });
      element.resizable({
        resize: function() {
          scope.$apply(function read() {
            scope.entity.width  = parseInt(element.css('width'));
            scope.entity.height = parseInt(element.css('height'));
          });
        }
      })
      element.click(function(e) {
        scope.$apply(function() {
          switch(scope.editor.mode) {
            case 'select':                 scope.editor.mode = 'entity'; break;
            case 'new_relationship_start': scope.beginRelationship(scope.entity); break;
            case 'new_relationship_end':   scope.endRelationship(scope.entity); break;
          }
        })
        e.stopPropagation();
      })
    }
  }
});

