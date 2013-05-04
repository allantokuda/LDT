function AbcController($scope) {
  $scope.rectangles = []
  $scope.rectangles[0] = {x: 130, y: 150, w: 100, h: 100}
  $scope.rectangles[1] = {x: 330, y: 170, w: 100, h: 100}
}

var myAppModule = angular.module('myApp', []);

angular.module("myApp").directive('rectangle', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      var options = scope.$eval(attributes.rectangle); //allow options to be passed in

      //jQuery UI call to add draggable function to the element
      element.draggable({
        // Update Angular model when this happens, because 
        // this jQuery event is outside of the Angular lifecycle
        drag: function(e,ui) { 
          scope.rectangles[scope.$index].x = ui.position.left
          scope.rectangles[scope.$index].y = ui.position.top
          scope.$apply();
        }
      });

      //jQuery UI call to add resizeable function to the element
      element.resizable({
        // Update Angular model when this happens, because 
        // this jQuery event is outside of the Angular lifecycle
        resize: function(e,ui) { 
          scope.rectangles[scope.$index].w = ui.size.width
          scope.rectangles[scope.$index].h = ui.size.height
          scope.$apply();
        }
      });
    }
  };
});
