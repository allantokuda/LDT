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

  //callback method
  this.update = function() {
    var distancePerDirection = {
      left:   entity1.x - entity2.x - entity2.width,
      right:  entity2.x - entity1.x - entity1.width,
      up:     entity1.y - entity2.y - entity2.height,
      down:   entity2.y - entity1.y - entity1.height
    };

    // Find the general direction from entity1 to entity2.
    // This is the direction with the largest distance between entities.
    var direction = _.max(DIRECTIONS, function(direction) {
      return distancePerDirection[direction];
    }, this);

    var x1, x2, y1, y2, side1, side2;
    switch(direction) {
      case 'right':
        x1 = entity1.x + entity1.width;
        x2 = entity2.x;
        side1 = 'right';
        side2 = 'left';
        break;

      case 'left':
        x1 = entity1.x;
        x2 = entity2.x + entity2.width;
        side1 = 'left';
        side2 = 'right';
        break;

      case 'down':
        y1 = entity1.y + entity1.height;
        y2 = entity2.y;
        side1 = 'bottom';
        side2 = 'top';
        break;

      case 'up':
        y1 = entity1.y + entity1.height;
        y2 = entity2.y;
        side1 = 'top';
        side2 = 'bottom';
        break;
    }

    if (direction == 'left' || direction == 'right') {

      var arrayAxis = 'y';
      var yCenter = 0.5*(entity1.y + 0.5*entity1.height + entity2.y + 0.5*entity2.height) //temporary rough average

      //TODO add array for siblings, and edge overflow prevention
      _.each(this.relationships, function(r) {
        r.place({ x: x1, y: yCenter, side: side1 },
                { x: x2, y: yCenter, side: side2 });
      });

    } else {

      var arrayAxis = 'x';
      var xCenter = 0.5*(entity1.x + 0.5*entity1.width + entity2.x + 0.5*entity2.width) //temporary rough average

      //TODO add array for siblings, and edge overflow prevention
      _.each(this.relationships, function(r) {
        r.place({ x: xCenter, y: y1, side: side1 },
                { x: xCenter, y: y2, side: side2 });
      });

    }

  };

  // Entities and their callback functions should always be defined,
  // except in unit tests.
  if (entity1 && entity1.addChangeCallback && entity2 && entity2.addChangeCallback) {
    entity1.addChangeCallback(this.update);
    entity2.addChangeCallback(this.update);
  }
};
