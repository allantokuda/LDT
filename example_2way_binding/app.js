
var app = angular.module('ldt', []);

app.controller('GraphCtrl', function($scope) {
  $scope.entities = [
    {x: "50px", y: "50px", width: "100px", height: "100px", name: "Supplier", attributes: ["name", "location"] },
    {x: "40px", y: "70px", width: "100px", height: "100px", name: "Part",     attributes: ["size", "shape", "color"] }
  ]
});

app.directive('entity',function() {
  return function postLink(scope, element, iAttrs, ctrl) {
    element.draggable({
        start: function() {
        },
        drag: function() {
          scope.$apply(function read() {
            scope.entity.x = element.css('left');
            scope.entity.y = element.css('top');
          });
        },
        stop: function() {
        }
      });
    element.resizable({
      resize: function() {
        scope.$apply(function read() {
          scope.entity.width = element.css('width');
          scope.entity.height = element.css('height');
        });
      }
    })
  }
});
