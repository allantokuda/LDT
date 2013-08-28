var app = angular.module('ldt', []);

app.controller('GraphCtrl', function($scope) {
  $scope.entities = [
    {x: 250, y: 70, width: 100, height: 130, name: "Supplier", attributes: ["name", "location"] },
    {x: 120, y: 90, width: 100, height: 130, name: "Part",     attributes: ["size", "shape", "color"] }
  ]
  $scope.linePath = function(){
    return "M" + _.map($scope.entities, function(e) {
      return (e.x + e.width / 2) + "," + (e.y + e.height / 2)
    }).join(" L")
  };
});

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
    }
  }
});

app.directive('entityHeading',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      element.bind('dblclick', function() {
        scope.$apply( function() {
          scope.renaming = !scope.renaming
        } );

        // Select the whole entity title for fast rename
        $(element.find("input")[0]).select()
      })
      element.keypress(function(e) {
        // scope.$apply seemed to be relevant here: http://stackoverflow.com/questions/14477904/how-to-create-on-change-directive-for-angularjs
        scope.$apply( function() {
          if (e.charCode == 13) {
            scope.renaming = false;
          }
        } )
      });
    }
  }
});

app.directive('relationship',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      scope.selected = false
      element.bind('click', function() {
        scope.selected = !scope.selected
        $(element).css('stroke', scope.selected ? 'blue' : 'black')
      })
    }
  }
});
