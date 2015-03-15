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
  }

  function boxRange(entity) {
    return {
      x: {
        min: entity.x,
        max: entity.x + entity.width
      },
      y: {
        min: entity.y,
        max: entity.y + entity.height
      }
    };
  }

  var updateNonReflexive = function() {
    var e1 = boxRange(entity1);
    var e2 = boxRange(entity2);
    var direction;

    var distancePerDirection = {
      right:  e2.x.min - e1.x.max,
      left:   e1.x.min - e2.x.max,
      down:   e2.y.min - e1.y.max,
      up:     e1.y.min - e2.y.max,
    };

    // Find the general direction from entity1 to entity2.
    // This is the direction with the largest distance between entities.
    direction = _.max(DIRECTIONS, function(direction) {
      return distancePerDirection[direction];
    }, this);

    var fixedAxis, arrayAxis, loc1, loc2, side1, side2;
    switch(direction) {
      case 'right':
        fixedAxis = 'x';
        arrayAxis = 'y';
        loc1 = 'max'; // from an entity's max coordinate
        loc2 = 'min'; // to other entity's min coordinate
        side1 = 'right';
        side2 = 'left';
        break;

      case 'left':
        fixedAxis = 'x';
        arrayAxis = 'y';
        loc1 = 'min';
        loc2 = 'max';
        side1 = 'left';
        side2 = 'right';
        break;

      case 'down':
        fixedAxis = 'y';
        arrayAxis = 'x';
        loc1 = 'max';
        loc2 = 'min';
        side1 = 'bottom';
        side2 = 'top';
        break;

      case 'up':
        fixedAxis = 'y';
        arrayAxis = 'x';
        loc1 = 'min';
        loc2 = 'max';
        side1 = 'top';
        side2 = 'bottom';
        break;
    }

    var range1 = { min: e1[arrayAxis].min, max: e1[arrayAxis].max };
    var range2 = { min: e2[arrayAxis].min, max: e2[arrayAxis].max };

    var arrayLocations = window.Distributor.distribute(this.relationships.length, range1, range2);

    _.each(this.relationships, function(r, i) {
      var placement1 = { side: side1 };
      var placement2 = { side: side2 };

      placement1[fixedAxis] = e1[fixedAxis][loc1];
      placement2[fixedAxis] = e2[fixedAxis][loc2];

      placement1[arrayAxis] = arrayLocations[0][i];
      placement2[arrayAxis] = arrayLocations[1][i];

      r.place(placement1, placement2);
    });
  }.bind(this);

  var updateReflexive = function() {
    var range = { min: entity1.y, max: entity1.y + entity1.height };
    var arrayLocations = window.Distributor.distribute(this.relationships.length*2, range);

    _.each(this.relationships, function(r, i) {
      r.place(
        {
          side: 'left',
          x: entity1.x,
          y: arrayLocations[0][i*2]
        },
        {
          side: 'left',
          x: entity1.x,
          y: arrayLocations[0][i*2+1]
        }
      );
    });
  }.bind(this);

  //callback method
  if (entity1 == entity2) {
    this.update = updateReflexive;
  } else {
    this.update = updateNonReflexive;
  }

  // Entities and their callback functions should always be defined,
  // except in unit tests.
  if (entity1 && entity1.addChangeCallback && entity2 && entity2.addChangeCallback) {
    entity1.addChangeCallback(this.update);
    entity2.addChangeCallback(this.update);
  }
};
