(function() {
  angular.module('LDT.entity').factory('EntityPair', function(_arrowHeadSize_) {

    var SIDES      = ['top', 'bottom', 'left', 'right'];
    var DIRECTIONS = ['up', 'down', 'left', 'right'];
    var arrowHeadSize = _arrowHeadSize_;

    return function(entity1, entity2) {
      this.entity1 = entity1;
      this.entity2 = entity2;
      this.relationships = [];
      this.pairs = [];

      var start1, start2, end1, end2;

      this.swapEntities = function() {
        var swap = this.entity2;
        this.entity2 = entity1;
        this.entity1 = swap;

      }

      this.refresh = function() {
        this.calculateOrientation();
        this.calculateRelevantCoordinates();
        this.calculateOverlapRange();
        this.calculatePriority();
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

      this.calculateRelevantCoordinates = function() {
        var x, y, width, height;

        // Map vertical case onto "horizontal" algorithm
        if (this.orientation == 0) {
          x = 'x'
          y = 'y'
          width = 'width'
          height = 'height'
        } else {
          x = 'y'
          y = 'x'
          width = 'height'
          height = 'width'
        }

        this.separation = entity2[x] - entity1[x] - entity1[width];

        this.start1  = entity1[y];
        this.start2  = entity2[y];
        this.end1    = entity1[y] + entity1[height];
        this.end2    = entity2[y] + entity2[height];
        this.center1 = entity1[y] + entity1[height] / 2;
        this.center2 = entity2[y] + entity2[height] / 2;
        //this.span1   = entity2[height];
        //this.span2   = entity2[height];
        this.offset     = this.center2 - this.center1;
      }

      this.calculateOverlapRange = function() {
        var start1 = this.start1;
        var start2 = this.start2;
        var end1   = this.end1;
        var end2   = this.end2;

        if (start1 >= start2 && start1 < end2) {
          this.overlapRange = (end1 < end2) ? [start1, end1] : [start1, end2];
        } else if (start2 >= start1 && start2 < end1) {
          this.overlapRange = (end1 < end2) ? [start2, end1] : [start2, end2];
        } else {
          this.overlapRange = null;
        }

        if (this.overlapRange !== null) {
          this.overlapMidpoint = (this.overlapRange[0] + this.overlapRange[1])/2;
          this.overlapSize = this.overlapRange[1] - this.overlapRange[0];
        } else {
          this.overlapMidpoint = null;
          this.overlapSize = 0;
        }
      }

      this.calculatePriority = function() {
        var skew, connectorAngle;
        var pad = arrowHeadSize.width
        var upper, lower;

        /*
         *  []--      <-- "upper" entity (skewed up)
         *      --[]  <-- "lower" entity (skewed down)
         */
        if (this.center1 > this.center2) {
          lower = { start: this.start1, end: this.end1 }
          upper = { start: this.start2, end: this.end2 }
        } else {
          lower = { start: this.start2, end: this.end2 }
          upper = { start: this.start1, end: this.end1 }
        }

        // Calculate how much a single relationship connecting these pairs
        // would need to be skewed laterally to stay connected.
        if (this.overlapSize >= pad) {
          skew = 0;
        } else {
          skew = lower.start - upper.end + pad
        }

        this.connectorAngle = Math.atan2(skew, this.separation - arrowHeadSize.length * 2) * 180 / 3.1416;

        this.placementPriority = Math.abs(10000 * this.connectorAngle + this.offset);
      };

      this.refresh();
    }

  });

})();
