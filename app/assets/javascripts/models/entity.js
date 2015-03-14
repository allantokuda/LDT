'use strict';

window.Entity = function(entity) {
  self = this;

  this.id         = entity.id;
  this.x          = entity.x;
  this.y          = entity.y;
  this.width      = entity.width;
  this.height     = entity.height;
  this.name       = entity.name;
  this.attributes = entity.attributes;

  this.SIDES = ['top', 'bottom', 'left', 'right'];
  this.endpoints = { top: [], left: [], right: [], bottom: [] };

  this.callbacks = [];

  this.saveObject = function() {
    return {
      id         : this.id,
      x          : this.x,
      y          : this.y,
      width      : this.width,
      height     : this.height,
      name       : this.name,
      attributes : this.attributes
    };
  };

  this.coordinates = function(xloc,yloc) {
    return {
      x: this.x + this.width  * xloc,
      y: this.y + this.height * yloc
    };
  };
  this.center = function() {
    return this.coordinates(0.5,0.5);
  };

  this.nearestSide = function(other) {
    return _.max(this.SIDES, function(side) {
      return this.outwardDistance(side, other);
    }, this);
  };

  this.outwardDistance = function(sideName, other) {
    return ({
      left:   this.x - other.x - other.width,
      top:    this.y - other.y - other.height,
      right:  other.x - this.x - this.width,
      bottom: other.y - this.y - this.height
    })[sideName];
  };

  this.sideCenterOffsetCoordinates = function(sideName, offset) {
    return ({
      top:     { x: this.x + this.width  / 2 + offset, y: this.y               },
      bottom:  { x: this.x + this.width  / 2 + offset, y: this.y + this.height },
      left:    { y: this.y + this.height / 2 + offset, x: this.x               },
      right:   { y: this.y + this.height / 2 + offset, x: this.x + this.width  }
    })[sideName];
  };

  this.coordinateRange = function(sideName) {
    return ({
      top:    { min: this.x, max: this.x + this.width },
      bottom: { min: this.x, max: this.x + this.width },
      left:   { min: this.y, max: this.y + this.height },
      right:  { min: this.y, max: this.y + this.height }
    })[sideName];
  };

  //TODO REMOVE
  this.span = function(sideName) {
    return ({
      top:    this.width,
      bottom: this.width,
      left:   this.height,
      right:  this.height
    })[sideName];
  };

  this.removeEndpoint = function(endpoint_to_remove) {
    _.each(this.SIDES, function(sideName) {
      this.endpoints[sideName] = _.without(this.endpoints[sideName], endpoint_to_remove);
    }, this);
  };

  this.addEndpoint = function(endpoint_to_add, sideName) {
    _.each(this.SIDES, function(sideName) {
      this.removeEndpoint(endpoint_to_add);
    }, this);

    this.endpoints[sideName].push(endpoint_to_add);
  };

  this.clearAllEndpoints = function() {
    var all = _.flatten(_.values(this.endpoints));

    _.each(this.SIDES, function(sideName) {
      this.endpoints[sideName] = [];
    }, this);

    return all;
  };

  this.addChangeCallback = function(callback) {
    this.callbacks.push(callback);
  };

  this.notifyChange = function() {
    _.each(this.callbacks, function(callback) {
      callback();
    });
  };
};
