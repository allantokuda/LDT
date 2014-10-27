(function() {
  angular.module('LDT.entity').factory('SideSpaceManager', function() {
    return function(entity, rangeFunction) {
      var range, occupiedTop, occupiedBottom;

      this.clear = function() {
        range = entity[rangeFunction]();
        totalSpace = range.max - range.min;
        occupiedTop = 0;
        occupiedBottom = 0;
      };
      this.clear();

      this.vacancy = function() {
        if (occupiedTop + occupiedBottom > range) {
          return null;
        } else {
          return {
            min: range.min + occupiedBottom,
            max: range.max - occupiedTop
          }
        }
      }
    };
  });
})();
