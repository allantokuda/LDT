
var app = angular.module('ldt', []);

app.controller('GraphCtrl', function($scope) {
  $scope.entities = []
  $scope.entities[0] = {x: "50px", y: "50px" };
  $scope.entities[1] = {x: "40px", y: "70px" };
});

app.directive('entity',function() {
  return {
    template: '<div class="entity" ng-style="{ top: entity.y, left: entity.x}"><div ng-transclude></div></entity>',
    restrict: 'E',
    transclude: true,
    replace: true,
    link: function postLink(scope, element, iAttrs, ctrl) {
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
    }
  };
});
