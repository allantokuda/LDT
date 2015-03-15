'use strict';

var ARROWHEAD_WIDTH = 20;
var MAX_SPREAD = 2;

window.Distributor = {

  overlapRange: function(range1, range2) {
    var rangeMin = _.max([range1.min, range2.min]);
    var rangeMax = _.min([range1.max, range2.max]);

    if (rangeMin < rangeMax)
      return { min: rangeMin, max: rangeMax };
    else
      return null;
  },

  topPortion: function(portion, range) {
    return {
      min: range.max - portion,
      max: range.max
    }
  },

  btmPortion: function(portion, range) {
    return {
      min: range.min,
      max: range.min + portion
    }
  },

  distribute: function(count, range1, range2) {
    if (range2 === undefined) range2 = range1;
    var overlap = this.overlapRange(range1, range2);
    var minSpace = count * ARROWHEAD_WIDTH;
    var maxSpace = count * ARROWHEAD_WIDTH * MAX_SPREAD;
    var distRanges = [];

    // possible to draw straight, well spaced relationships
    if (overlap && overlap.max - overlap.min > minSpace) {
      if (overlap.max - overlap.min > maxSpace) {
        var center = 0.5*(overlap.max + overlap.min);
        var fullSpreadRange = {
          min: center - 0.5*maxSpace,
          max: center + 0.5*maxSpace
        }
        distRanges = [fullSpreadRange, fullSpreadRange];
      } else {
        distRanges = [overlap, overlap];
      }

    // impossible to draw straight, well-spaced relationships
    } else {
      var ranges = [range1, range2]

      _.times(2, function(i) {
        var sideCenter = 0.5*(ranges[i].max + ranges[i].min);
        var otherSideCenter = 0.5*(ranges[1-i].max + ranges[1-i].min);

        // Current side has enough room.
        if (ranges[i].max - ranges[i].min > minSpace) {

          // Other side is aligned with current side.
          if (ranges[i].max > otherSideCenter + 0.5*minSpace &&
              ranges[i].min < otherSideCenter - 0.5*minSpace) {
            distRanges[i] = {
              min: otherSideCenter - 0.5*minSpace,
              max: otherSideCenter + 0.5*minSpace
            }

          // Other side is offset from current side.
          } else {
            if (sideCenter < otherSideCenter) {
              distRanges[i] = this.topPortion(minSpace, ranges[i]);
            } else {
              distRanges[i] = this.btmPortion(minSpace, ranges[i]);
            }
          }
        // Current side itself does not have enough room
        } else {
          // just cram it all in there anyway
          distRanges[i] = ranges[i];
        }

      }, this);
    }

    return _.map(distRanges, function(range) {
      if (count == 1) {
        return [0.5*(range.min + range.max)];
      } else if (count > 1) {
        var start = range.min + 0.5*ARROWHEAD_WIDTH;
        var step = (range.max - range.min - ARROWHEAD_WIDTH) / (count - 1);
        var result = [];
        _.times(count, function(i) {
          result.push(start + step * i);
        });
        return result;
      } else {
        // maybe if count is zero? Generally should not happen..
        return [];
      }
    });
  }
};
