(function() {

  var SIDES      = ['top', 'bottom', 'left', 'right'];
  var DIRECTIONS = ['up', 'down', 'left', 'right'];

  function EntityPair(entity1, entity2) {
    this.entity1 = entity1;
    this.entity2 = entity2;
    this.relationships = [];
    this.pairs = [];

    this.swapEntities = function() {
      var swap = this.entity2;
      this.entity2 = entity1;
      this.entity1 = swap;
    }

    this.refresh = function() {
      this.calculateOrientation();
      this.calculateOverlapRange();
    }

    this.calculateOrientation = function() {
      var directionFromFirstToSecond = _.max(DIRECTIONS, function(direction) {
        return this.outwardDistance(direction);
      }, this);

      switch(directionFromFirstToSecond) {
        case 'up':
          this.swapEntities();
        case 'down':
          this.orientation = 1;
          break;
        case 'left':
          this.swapEntities();
        case 'right':
          this.orientation = 0;
      }
    };

    this.outwardDistance = function(direction) {
      return ({
        left:  this.entity1.x - this.entity2.x - this.entity2.width,  // e2 is to the left of e1
        up:    this.entity1.y - this.entity2.y - this.entity2.height, // e2 is above e1
        right: this.entity2.x - this.entity1.x - this.entity1.width,  // e2 is to the right of e1
        down:  this.entity2.y - this.entity1.y - this.entity1.height  // e2 is below e1
      })[direction];
    };

    this.calculateOverlapRange = function() {

      // 0 == horizontal, 1 == vertical
      if (this.orientation == 1) {
        start = 'x';
        length = 'width';
      } else {
        start = 'y';
        length = 'height';
      }

      start1 = entity1[start];
      start2 = entity2[start];
      end1   = entity1[start] + entity1[length];
      end2   = entity2[start] + entity2[length];

      if (start1 > start2 && start1 < end2) {
        this.overlapRange = (end1 < end2) ? [start1, end1] : [start1, end2];
      } else if (start2 > start1 && start2 < end1) {
        this.overlapRange = (end1 < end2) ? [start2, end1] : [start2, end2];
      } else {
        this.overlapRange = null;
      }

      if (this.overlapRange !== null) {
        this.overlapMidpoint = (this.overlapRange[0] + this.overlapRange[1])/2;
      } else {
        this.overlapMidpoint = null;
      }
    }

    this.refresh();
  }

  angular.module('LDT.entity').value('EntityPair', EntityPair);
})();
