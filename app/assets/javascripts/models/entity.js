'use strict';

window.Entity = function(entity) {
  var callbacks = [];

  this.id         = entity.id;
  this.x          = entity.x;
  this.y          = entity.y;
  this.width      = entity.width;
  this.height     = entity.height;
  this.name       = entity.name;
  this.attributes = entity.attributes;

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

  this.addChangeCallback = function(callback) {
    callbacks.push(callback);
  };

  this.notifyChange = function() {
    _.each(callbacks, function(callback) {
      callback();
    });
  };
};
