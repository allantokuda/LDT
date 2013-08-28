
var app = angular.module('ldt', []);

app.controller('GraphCtrl', function($scope) {
  $scope.entities = [
    {x: 250, y: 70, width: 100, height: 130, name: "Supplier", attributes: ["name", "location"] },
    {x: 120, y: 90, width: 100, height: 130, name: "Part",     attributes: ["size", "shape", "color"] }
  ]
  $scope.renaming = false
});

app.directive('entity',function() {
  return function postLink(scope, element, iAttrs, ctrl) {
    element.draggable({
        start: function() {
        },
        drag: function() {
          scope.$apply(function read() {
            scope.entity.x = parseInt(element.css('left'));
            scope.entity.y = parseInt(element.css('top'));
          });
        },
        stop: function() {
        }
      });
    element.resizable({
      resize: function() {
        scope.$apply(function read() {
          scope.entity.width  = parseInt(element.css('width'));
          scope.entity.height = parseInt(element.css('height'));
        });
      }
    })
  }
});

app.directive('entityHeading',function() {
  return function(scope, element, iAttrs, ctrl) {
    element.bind('dblclick', function() {
      console.log(scope.entity.name)
    })
  }
});
