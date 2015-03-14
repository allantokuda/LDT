'use strict';

window.Relationship = function(id, entity1, entity2) {

  this.id = id;
  this.endpoints = [
    new window.Endpoint({ entity: entity1, otherEntity: entity2 }),
    new window.Endpoint({ entity: entity2, otherEntity: entity1 })
  ];
  this.endpoints[0].partner = this.endpoints[1];
  this.endpoints[1].partner = this.endpoints[0];

  this.svgPath = function() {

    var arrowTip = [];
    arrowTip[0] = this.endpoints[0];
    arrowTip[1] = this.endpoints[1];

    var arrowBase = _.map(arrowTip, function(tip) {
      return {
        x: (tip.x + tip.outwardVector.x * ARROWHEAD_LENGTH),
        y: (tip.y + tip.outwardVector.y * ARROWHEAD_LENGTH)
      };
    });

    function svgPolyline(points) {
      if (points.length >= 2)
        return "M" + _.map(points, function(point) {
          return Math.round(point.x) + ',' + Math.round(point.y);
        }).join(' L');
    }

    return svgPolyline([arrowTip[0], arrowBase[0], arrowBase[1], arrowTip[1]]);
  };

  this.saveObject = function() {
    return {
      id         : this.id,
      entity1_id : this.endpoints[0].entity.id,
      entity2_id : this.endpoints[1].entity.id,
      symbol1    : this.endpoints[0].symbol,
      symbol2    : this.endpoints[1].symbol,
      label1     : this.endpoints[0].label,
      label2     : this.endpoints[1].label
    };
  };

  this.place = function() {
  };
};
