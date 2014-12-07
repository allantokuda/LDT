'use strict';

angular.module('LDT.ui').directive('autoFocus',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var regex = /([-.#\w\d]+) on ([\w]+)/;
      var matches = regex.exec(iAttrs.autoFocus);
      var params = _.object(['targetSelector', 'eventName'], matches.slice(1,3));

      element.bind(params.eventName, function(e) {
        // Select the whole entity title for fast rename
        $(element.find(params.targetSelector)[0]).select();
      });
    }
  };
});

