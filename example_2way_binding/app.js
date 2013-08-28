var app = angular.module('ldt', []);

app.controller('GraphCtrl', function($scope) {
  $scope.entities = [
    {x: 250, y: 70, width: 100, height: 130, name: "Supplier", attributes: ["name", "location"] },
    {x: 120, y: 90, width: 100, height: 130, name: "Part",     attributes: ["size", "shape", "color"] }
  ]
  $scope.entityBeingRenamed = null

  var points = [
    {x: 30, y: 180},
    {x: 50, y:  80},
    {x: 70, y: 170},
    {x: 90, y:  70}
  ];

  $scope.points = points;

  // http://gaslight.co/blog/angular-backed-svgs
  // http://jsbin.com/UCUtIhe/1/edit
  $scope.linePath = function(){
    var pathParts = [], currentPoint, i;

    for (i = 0; i < points.length; i++) {
      currentPoint = points[i];
      pathParts.push(currentPoint.x + "," + currentPoint.y);
    }

    pathStr = "M" + pathParts.join(" L");
    console.log(pathStr)
    return pathStr
  };
});

app.directive('entity',function() {
  return {
    link: function (scope, element, iAttrs, ctrl) {
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

//app.directive('relationship',function() {
//  return {
//    link: function(scope, element, iAttrs, ctrl) {
//      console.log(element)
//      console.log(scope)
//      iAttrs.$set('points', scope.points);
//    }
//  }
//});
