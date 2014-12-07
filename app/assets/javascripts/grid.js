'use strict';

angular.module('LDT.geometry')
.value('GRIDSIZE', 10)
.service('grid', ['GRIDSIZE', function(GRIDSIZE) {
  return {
    snap: function(n) {
      return Math.floor((n + GRIDSIZE/2.0)/GRIDSIZE)*GRIDSIZE
    }
  }
}]);
