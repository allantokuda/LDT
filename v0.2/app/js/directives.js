'use strict';

/* Directives */

var app = angular.module('myApp.directives', [])

app.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

app.directive('entitySet',function() {
  return function(scope, element, iAttrs, ctrl) {
    element.selectable();
  }
})

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
      element.click(function(e) {
        scope.$apply(function() {
          //switch(scope.editor.mode) {
            //case 'select':
              _.each(element.siblings(), function(sibling) {
                $(sibling).removeClass('selected');
              })
              element.addClass('selected');
              //scope.editor.mode = 'entity';
              //break;
            //case 'new_relationship_start': scope.beginRelationship(scope.entity); break;
            //case 'new_relationship_end':   scope.endRelationship(scope.entity); break;
          //}
        })
        e.stopPropagation();
      })
      //element.selectable(); //{
        // click: function() {
        //   scope.$apply(function read() {
        //     console.log('selected')
        //   });
        // }
      //})
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
        });

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

