'use strict';

window.Path = function(entity1, entity2) {
  self = this;

  var DIRECTIONS = ['up', 'down', 'left', 'right'];
  var SIDES = ['top', 'bottom', 'left', 'right'];

  this.relationships = [];

  this.addRelationship = function(subject) {
    if (!find(subject)) {
      this.relationships.push(subject);
    }
  };

  this.removeRelationship = function(subject) {
    this.relationships = _.reject(this.relationships, function(r){
      return r === subject;
    });
  };

  //private methods

  function find(subject) {
    return _.find(self.relationships, function(r){
      return r === subject;
    });
  };

  function bestSides() {
    var distancePerDirection = {
      left:   entity1.x - entity2.x - entity2.width,
      up:     entity1.y - entity2.y - entity2.height,
      right:  entity2.x - entity1.x - entity1.width,
      down:   entity2.y - entity1.y - entity1.height
    };

    // find direction in which largest distance between entities is seen
    var direction = _.max(DIRECTIONS, function(direction) {
      return distancePerDirection[direction];
    }, this);

    var sidesPerDirection = {
      left:  ['left', 'right'],
      up:    ['top', 'bottom'],
      right: ['right', 'left'],
      down:  ['bottom', 'top']
    };

    return sidesPerDirection[direction];
  };

  //callback method
  this.update = function() {
    var sides = bestSides();

    _.each(this.relationships, function(r) {
      r.place({ x: 100, y: 50, side: sides[0] },
              { x: 200, y: 50, side: sides[1] });
    });
  };

};
