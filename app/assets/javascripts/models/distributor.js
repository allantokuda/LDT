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

  distribute: function(count, range1, range2) {
    var range = this.overlapRange(range1, range2);
    var rangeCenter = 0.5*(range.max + range.min)

    return [[rangeCenter], [rangeCenter]];
  }
};
