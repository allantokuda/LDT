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

      var x, y, width, height, center1, center2,
          separation, offset,
          start1, start2, end1, end2;

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
            // fall through
          case 'down':
            this.orientation = 1;
            break;
          case 'left':
            this.swapEntities();
            // fall through
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

        separation = entity2[x] - entity1[x] - entity1[width];
        innerLeft  = entity1[x] + entity1[width];
        innerRight = entity2[x];

        start1  = entity1[y];
        start2  = entity2[y];
        end1    = entity1[y] + entity1[height];
        end2    = entity2[y] + entity2[height];
        center1 = entity1[y] + entity1[height] / 2;
        center2 = entity2[y] + entity2[height] / 2;
        offset = center2 - center1;
      }

      this.calculateOverlapRange = function() {
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
        if (center1 > center2) {
          lower = { start: start1, end: end1 }
          upper = { start: start2, end: end2 }
        } else {
          lower = { start: start2, end: end2 }
          upper = { start: start1, end: end1 }
        }

        // Calculate how much a single relationship connecting these pairs
        // would need to be skewed laterally to stay connected.
        if (this.overlapSize >= pad) {
          skew = 0;
        } else {
          skew = lower.start - upper.end + pad
        }

        connectorAngle = Math.atan2(skew, separation - arrowHeadSize.length * 2) * 180 / 3.1416;

        this.placementPriority = Math.abs(10000 * connectorAngle + offset);
      };

      // Make use of the virtual "inner left/right" coordinates
      // which automatically change meaning depending on orientation
      // to actually mean innerTop and innerBottom.
      this.straightConnectionPointPair = function(pos) {
        if (this.orientation == 0) {
          return [ { x: innerLeft,  y: pos },
                   { x: innerRight, y: pos } ];
        } else {
          return [ { x: pos, y: innerLeft  },
                   { x: pos, y: innerRight } ];
        }
      }

      this.connectionPoints = function(min, max) {
        var count = this.relationships.length;
        var result = [];

        // Single relationship gets centered on the space
        if (count == 1) {
          result.push(this.straightConnectionPointPair(this.overlapMidpoint));

        // Multiple relationships are spread evenly across the space
        } else if (count > 1) {
          var x1 = this.overlapRange[0] + arrowHeadSize.width / 2;
          var xn = this.overlapRange[1] - arrowHeadSize.width / 2;
          var connectionRange = xn - x1;
          var pos;

          for (var i=0; i<count; i++) {
            pos = x1 + connectionRange * i / (count - 1);
            result.push(this.straightConnectionPointPair(pos));
          }
        }

        return result;
      };

      this.refresh();
    }

  });

})();
