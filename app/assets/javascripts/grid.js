angular.module('LDT').service('grid', function() {
  var GRIDSIZE = 10;
  return {
    snap: function(n) {
      return Math.floor((n + GRIDSIZE/2.0)/GRIDSIZE)*GRIDSIZE
    }
  }
});
