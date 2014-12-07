'use strict';

// Setup entities to be draggable and resizable, and bind to the scope
angular.module('LDT.ui').directive('selectWith',function() {
  return {
    link: function (scope, element, iAttrs, ctrl) {
      var regex = /([\w\d]+) as ([\w\d]+)/;
      var matches = regex.exec(iAttrs.selectWith);
      var params = _.object(['eventName', 'varName'], matches.slice(1,3));

      // Don't allow parent to get the click again
      element.click(function(e) { e.stopPropagation(); });

      //Define variable if not externally defined
      if (typeof(scope[params.varName]) == 'undefined')
        scope[params.varName] = {};

      var scopeVar = scope[params.varName];
      scopeVar.selected = false;

      //Setup class to watch the scope
      scope.$watch(params.varName + '.selected', function(selected) {
        var stopListening;

        if (scopeVar.selected) {
          element.addClass('selected');

          stopListening = scope.$on('deselectAll', function() {
            scope.$apply( function() { scopeVar.selected = false; });
          });

        } else {
          element.removeClass('selected');
          if (stopListening !== undefined) stopListening();
        }
      });

      //Set true when activated by specified event (and start listening for 'deselectAll');
      //set false when 'deselectAll' is broadcast (and stop listening for 'deselectAll').
      element.bind(params.eventName, function(e) {
        scope.$apply( function() { scopeVar.selected = true; });

        e.stopPropagation();
      });
    }
  };
});

