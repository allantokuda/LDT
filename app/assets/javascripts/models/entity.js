window.Entity = function(entity) {

  this.id         = entity.id
  this.x          = entity.x
  this.y          = entity.y
  this.width      = entity.width
  this.height     = entity.height
  this.name       = entity.name
  this.attributes = entity.attributes

  var SIDES = ['top', 'bottom', 'left', 'right'];
  this.endpoints = { top: [], left: [], right: [], bottom: [] };

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
    }
  }
  this.center = function() {
    return this.coordinates(0.5,0.5)
  }

  this.nearestSide = function(other) {
    return _.max(SIDES, function(side) {
      return this.outwardDistance(side, other);
    }, this);
  }

  this.outwardDistance = function(sideName, other) {
    return ({
      left:   this.x - other.x - other.width,
      top:    this.y - other.y - other.height,
      right:  other.x - this.x - this.width,
      bottom: other.y - this.y - this.height
    })[sideName];
  }

  this.sideCenterOffsetCoordinates = function(sideName, offset) {
    return ({
      top:     { x: this.x + this.width  / 2 + offset, y: this.y               },
      bottom:  { x: this.x + this.width  / 2 + offset, y: this.y + this.height },
      left:    { y: this.y + this.height / 2 + offset, x: this.x               },
      right:   { y: this.y + this.height / 2 + offset, x: this.x + this.width  }
    })[sideName];
  };

  this.span = function(sideName) {
    return ({
      top:    this.width,
      bottom: this.width,
      left:   this.height,
      right:  this.height,
    })[sideName];
  }
}
