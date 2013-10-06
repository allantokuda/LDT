window.Entity = function(entity) {

  this.id         = entity.id
  this.x          = entity.x
  this.y          = entity.y
  this.width      = entity.width
  this.height     = entity.height
  this.name       = entity.name
  this.attributes = entity.attributes

  this.sides = {};

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

  _.each(window.SIDENAMES, _.bind(function(sideName) {
    this.sides[sideName] = new window.Side(this, sideName);
  },this));

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
    return _.max(this.sides, function(side) {
      return this.outwardDistance(side.name, other);
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

}
