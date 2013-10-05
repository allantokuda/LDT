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
    return _.max(
      _.values(this.sides),
      function(side) { return side.outwardDistance(other) }
    );
  }

  this.attachEndpoint = function(newEndpoint) {
    this.endpoints.push(newEndpoint);
  }

  this.removeEndpoint = function(endpoint_to_delete) {
    this.endpoints = _.reject(this.endpoints, function(endpoint) {
      return endpoint == endpoint_to_delete
    });

    _.each(this.sides, function(side) {
      side.removeEndpoint(endpoint_to_delete);
    });
  };

  this.assignEndpointsToSides = function() {
    _.each(this.endpoints, function(endpoint) { endpoint.relocate(); });
  }

  this.negotiateEndpointsOnEachSide = function() {
    _.each(_.values(this.sides), function(side) {
      side.negotiateEndpoints();
    });
  }

  this.stringGeom = function() {
    return [this.x, this.y, this.width, this.height].join(',')
  }

  this.updateAssociations = function() {
    _.each(this.endpoints, function(endpoint) {
      endpoint.partner.relocate();
      endpoint.partner.entity.negotiateEndpointsOnEachSide();
    });
  };

  this.triggerUpdate = function() {
    //rearchitecture: broadcast event here instead of calling endpoint methods directly
    //both assignEndpointsToSides and updateAssociations will be replaced by this.
    //endpoints know they need to relocate if EITHER their main or secondary entity has moved.
    this.assignEndpointsToSides();
    this.updateAssociations();
    this.negotiateEndpointsOnEachSide();
  };

}
