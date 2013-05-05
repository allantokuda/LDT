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
        // If these could be implemented in pure Angular instead of jQuery,
        // it should not be necessary to do this.
        drag: function(e,ui) { 
          scope.rectangles[scope.$index].x = ui.position.left
          scope.rectangles[scope.$index].y = ui.position.top
          scope.$apply();
        }
      });

      //jQuery UI call to add resizeable function to the element
      element.resizable({
        // Update Angular model when this happens, because 
        // this jQuery event is outside of the Angular lifecycle.
        // Need to include x and y here again because resizing up or left affects both size and position.
        // If we don't, Angular causes weird behavior: It only is informed about the size change,
        // so when it does its processing it overrides the positioning done correctly by jQuery.
        // So when you try to drag the left border to the left, you instead see the left border stay still
        // and the right border moves right.
        resize: function(e,ui) { 
          scope.rectangles[scope.$index].x = ui.position.left
          scope.rectangles[scope.$index].y = ui.position.top
          scope.rectangles[scope.$index].w = ui.size.width
          scope.rectangles[scope.$index].h = ui.size.height
          scope.$apply();
        },
        handles: 'n,s,e,w',
      });
    }
  };
});
