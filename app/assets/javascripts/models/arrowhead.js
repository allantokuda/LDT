'use strict';

window.ARROWHEAD_LENGTH = 30;
window.ARROWHEAD_WIDTH = 20;

window.ARROWHEAD = {
  box:  [['m',0,1.5],['l',4,0],['l',0,-3],['l',-4,0],['l',0,3]],
  none: [['m',0,0], ['l',1,0]],
  '?':  [['m',0.7, 0.3], ['l',0, 0.4], ['l',0.4,0], ['l',0,-0.2], ['l',0.2,0], ['m',0.2,0], ['l',0.2,0]],
  chickenfoot: [['m',0,1], ['l',2,-1], ['l',-2,-1]],
  identifier:  [['m',1.5,1], ['l',0,-2]],
  chickenfoot_identifier:  [['m',0,1], ['l',2,-1], ['l',-2,-1], ['m',2.5,2], ['l',0,-2]]
};

// Precalculate SVG strings for all arrowheads
window.arrowheadSVG = {};
var scale = Math.round(window.ARROWHEAD_WIDTH / 2);
_.each(_.pairs(window.ARROWHEAD), function(pair) {
  var type   = pair[0];
  var points = pair[1];
  window.arrowheadSVG[type] = {};
  _.each(['top', 'bottom', 'left', 'right'], function(sideName) {
    window.arrowheadSVG[type][sideName] = _.map(points, function(point) {
      var x = {
        top:    point[0] + (-scale * point[2]) + ',' + (-scale * point[1]),
        bottom: point[0] + ( scale * point[2]) + ',' + ( scale * point[1]),
        left:   point[0] + (-scale * point[1]) + ',' + ( scale * point[2]),
        right:  point[0] + ( scale * point[1]) + ',' + (-scale * point[2])
      };
      return x[sideName];
    }).join(' ');
  });
});
