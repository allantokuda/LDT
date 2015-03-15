'use strict';

var ARROWHEAD_WIDTH = 20;

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
    var overlap = this.overlapRange(range1, range2);
    var minSpace = count * ARROWHEAD_WIDTH;
    var distRanges;

    if (overlap && overlap.max - overlap.min > minSpace) {
      distRanges = [overlap, overlap];
    } else {
      if (range1.min < range2.min) {
        distRanges = [
          this.topPortion(minSpace, range1),
          this.btmPortion(minSpace, range2)
        ]
      } else {
        distRanges = [
          this.btmPortion(minSpace, range1),
          this.topPortion(minSpace, range2)
        ]
      }
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
