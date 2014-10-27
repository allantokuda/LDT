(function() {
  angular.module('LDT.entity').factory('SideSpaceManager', function() {
    return function(entity, rangeFunction) {
      var range, occupancyOnMinSide, occupancyOnMaxSide;

      this.clear = function() {
        range = entity[rangeFunction]();
        totalSpace = range.max - range.min;
        occupancyOnMinSide = 0;
        occupancyOnMaxSide = 0;
      };
      this.clear();

      this.vacancy = function() {
        if (occupancyOnMinSide + occupancyOnMaxSide >= totalSpace) {
          return null;
        } else {
          return {
            min: range.min + occupancyOnMinSide,
            max: range.max - occupancyOnMaxSide
          }
        }
      };

      // Occupy space on either end of the coordinate range:
      // minOrMaxSide: -1 for "min" side, 1 for "max" side
      // amount: amount of space to occupy
      this.occupy = function(minOrMaxSide, amount) {
        if (minOrMaxSide == -1) {
          occupancyOnMinSide += amount;
        } else {
          occupancyOnMaxSide += amount;
        }
      };
    };
  });
})();
