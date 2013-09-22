window.Entity = function(entity) {

  this.id         = entity.id
  this.x          = entity.x
  this.y          = entity.y
  this.width      = entity.width
  this.height     = entity.height
  this.name       = entity.name
  this.attributes = entity.attributes

  this.endpoints = [];
  this.sides = {};

  _.each(window.SIDENAMES, _.bind(function(sideName) {
    this.sides[sideName] = new window.Side(this, sideName);
  },this));

  this.coordinates = function(xloc,yloc) {
    return {
      x: Math.round(this.x + this.width  * xloc),
      y: Math.round(this.y + this.height * yloc)
    }
  }
  this.center = function() {
    return this.coordinates(0.5,0.5)
  }

  this.nearestSide = function(other) {
    return _.max(
      _.values(this.sides),
      function(side) { return side.outwardDistance(other) }
    );
  }

  this.attachEndpoint = function(endpoint) {
    this.endpoints.push(endpoint);
  }

  this.assignEndpointsToSides = function() {
    _.each(this.endpoints, function(endpoint) { endpoint.relocate(); });
  }

  this.negotiateEndpointsOnEachSide = function() {
    _.each(side, function(side) {
      side.negotiateEndpoints();
    });
  }
}
