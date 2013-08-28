
var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope) {
  $scope.myboxes = []
  $scope.myboxes[0] = {x: "50px", y: "50px" };
  $scope.myboxes[1] = {x: "40px", y: "70px" };
});

app.directive('box',function() {
  return {
    template: '<div id="box" ng-style="{ top: box.y, left: box.x}"><div ng-transclude></div></box>',
    restrict: 'E',
    transclude: true,
    replace: true,
    link: function postLink(scope, element, iAttrs, ctrl) {
      element.draggable({
          start: function() {
            console.log('start');
          },
          drag: function() {
            console.log('drag');
            scope.$apply(function read() {
              scope.box.x = element.css('left');
              scope.box.y = element.css('top');
            });
          },
          stop: function() {
            console.log('stop');
          }
        });
    }
  };
});
