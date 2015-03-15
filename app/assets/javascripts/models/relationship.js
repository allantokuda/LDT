'use strict';

window.Relationship = function(id, entity1, entity2) {
  self = this;

  this.id = id;
  this.entity1_id = entity1.id;
  this.entity2_id = entity2.id;

  this.standardOrientation = entity1.id < entity2.id;

  this.endpoints = [
    new window.Endpoint({}),
    new window.Endpoint({})
  ];

  function svgPolyline(points) {
    if (points.length >= 2) {
      return "M" + _.map(points, function(point) {
        return Math.round(point.x) + ',' + Math.round(point.y);
      }).join(' L');
    }
  }

  this.svgPath = function() {

    var arrowBases = _.map(this.endpoints, function(tip) {
      return {
        x: (tip.x + tip.outwardVector.x * ARROWHEAD_LENGTH),
        y: (tip.y + tip.outwardVector.y * ARROWHEAD_LENGTH)
      };
    }.bind(this));

    return svgPolyline([this.endpoints[0], arrowBases[0], arrowBases[1], this.endpoints[1]]);
  };

  this.saveObject = function() {
    return {
      id         : this.id,
      entity1_id : this.entity1_id,
      entity2_id : this.entity2_id,
      symbol1    : this.endpoints[0].symbol,
      symbol2    : this.endpoints[1].symbol,
      label1     : this.endpoints[0].label,
      label2     : this.endpoints[1].label
    };
  };

  this.place = function(point1, point2) {
    var ep1, ep2;

    if (this.standardOrientation) {
      ep1 = this.endpoints[0];
      ep2 = this.endpoints[1];
    } else {
      ep1 = this.endpoints[1];
      ep2 = this.endpoints[0];
    }

    ep1.x = point1.x;
    ep1.y = point1.y;
    ep1.sideName = point1.side;
    ep1.setOutwardVector();

    ep2.x = point2.x;
    ep2.y = point2.y;
    ep2.sideName = point2.side;
    ep2.setOutwardVector();
  };
};
