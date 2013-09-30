window.ARROWHEAD_LENGTH = 30
window.ARROWHEAD_WIDTH = 20

window.ARROWHEAD = {
  box:  [['m',0,1.5],['l',4,0],['l',0,-3],['l',-4,0],['l',0,3]],
  none: [['m',0,0]],
  '?':  [['m',0.7, 0.3], ['l',0, 0.4], ['l',0.4,0], ['l',0,-0.2], ['l',0.2,0], ['m',0.2,0], ['l',0.2,0]],
  chickenfoot: [['m',0,1], ['l',2,-1], ['l',-2,-1]],
  identifier:  [['m',1.5,1], ['l',0,-2]],
  chickenfoot_identifier:  [['m',0,1], ['l',2,-1], ['l',-2,-1], ['m',2.5,2], ['l',0,-2]],
};

// Precalculate SVG strings for all arrowheads
window.arrowheadSVG = {};
var scale = Math.round(ARROWHEAD_WIDTH / 2);
_.each(_.pairs(window.ARROWHEAD), function(pair) {
  type   = pair[0];
  points = pair[1];
  window.arrowheadSVG[type] = {};
  _.each(['top', 'bottom', 'left', 'right'], function(sideName) {
    window.arrowheadSVG[type][sideName] = _.map(points, function(point) {
      var x = {
        top:    point[0] + (-scale * point[2]) + ',' + (-scale * point[1]),
        bottom: point[0] + ( scale * point[2]) + ',' + ( scale * point[1]),
        left:   point[0] + (-scale * point[1]) + ',' + ( scale * point[2]),
        right:  point[0] + ( scale * point[1]) + ',' + (-scale * point[2])
      }
      return x[sideName];
    }).join(' ');
  });
});

window.Arrowhead = function(endpoint) {

  this.endpoint = endpoint;

  this.svgPath = function() {
    var type = this.endpoint.symbol;
    var side = this.endpoint.side.name;
    var position = "M" + this.endpoint.x + ',' + this.endpoint.y + ' '
    return position + window.arrowheadSVG[type][side];
  }

  this.boxPath = function() {
    var type = this.endpoint.symbol;
    var side = this.endpoint.side.name;
    var position = "M" + this.endpoint.x + ',' + this.endpoint.y + ' '
    return position + window.arrowheadSVG['box'][side];
  }

  this.switchType = function(switchIdentifier) {
    if (switchIdentifier) {
      switch(this.endpoint.symbol) {
        case 'none':                   this.endpoint.symbol = 'identifier'; break;
        case 'identifier':             this.endpoint.symbol = 'none'; break;
        case 'chickenfoot':            this.endpoint.symbol = 'chickenfoot_identifier'; break;
        case 'chickenfoot_identifier': this.endpoint.symbol = 'chickenfoot'; break;
        case '?':                      this.endpoint.symbol = 'identifier'; break;
      }
    } else {
      switch(this.endpoint.symbol) {
        case 'none':                   this.endpoint.symbol = 'chickenfoot'; break;
        case 'chickenfoot':            this.endpoint.symbol = 'none'; break;
        case 'identifier':             this.endpoint.symbol = 'chickenfoot_identifier'; break;
        case 'chickenfoot_identifier': this.endpoint.symbol = 'identifier'; break;
        case '?':                      this.endpoint.symbol = 'none'; break;
      }
    }
  }
}
