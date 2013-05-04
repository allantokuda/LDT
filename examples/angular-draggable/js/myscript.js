function AbcController($scope) {
  $scope.x = 130;
  $scope.y = 150;
  $scope.w = 100;
  $scope.h = 100;
}

var myAppModule = angular.module('myApp', []);

angular.module("myApp").directive('dialog', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var options = scope.$eval(attrs.dialog); //allow options to be passed in

      //jQuery UI call to add draggable function to the element
      element.draggable({
        // Update Angular model when this happens, because 
        // this jQuery event is outside of the Angular lifecycle
        drag: function(e,ui) { 
          scope.x = ui.position.left
          scope.y = ui.position.top
          scope.$apply();
        }
      });

      //jQuery UI call to add resizeable function to the element
      element.resizable({
        // Update Angular model when this happens, because 
        // this jQuery event is outside of the Angular lifecycle
        resize: function(e,ui) { 
          scope.w = ui.size.width
          scope.h = ui.size.height
          scope.$apply();
        }
      });
    }
  };
});
