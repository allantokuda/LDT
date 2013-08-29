var app = angular.module('ldt', []);

app.controller('GraphCtrl', function($scope) {
  // Set initial edit mode
  $scope.editMode = 'select';

  // Define some test data (TODO: load and persist to server)
  $scope.entities = [
    {x: 120, y: 70, width: 100, height: 130, name: "Supplier", attributes: ["name", "location"] },
    {x: 250, y: 90, width: 100, height: 130, name: "Part",     attributes: ["size", "shape", "color"] }
  ]

  // Draw simple chain of relationships for proof of concept
  $scope.linePath = function(){
    return "M" + _.map($scope.entities, function(e) {
      return (e.x * 1 + e.width / 2) + "," + (e.y * 1 + e.height / 2)
    }).join(" L")
  };

  // Switch modes using keyboard
  $(window).keypress(function(e) {
    console.log(e)
    switch (e.charCode) {
      case 13:  /* Enter */ $scope.$apply(function() { $scope.editMode = 'select';      } ); break;
      case 101: /* e     */ $scope.$apply(function() { $scope.editMode = 'new_entity'; } ); break;
    }
  })

  // Respond to click event to complete an action
  $("#canvas").click(function(e) {
    if ($scope.editMode == 'new_entity') {
      $scope.$apply(function() {
        $scope.entities.push({x: e.offsetX, y: e.offsetY, width: 100, height: 130, name: "New Entity", attributes: ["new_entity_id"]})
        $scope.editMode = 'select'
      })
    }
  });
});

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
    }
  }
});

// Setup entity headings to be double-click renamable
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

// Setup relationships to be "selectable" when you click on them
// TODO: replace with canvas click event to pick the nearest relationship
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
