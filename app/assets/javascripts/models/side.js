window.SIDENAMES = ['top', 'bottom', 'left', 'right'];
window.ARROWHEAD_LENGTH = 30
window.ARROWHEAD_WIDTH = 20

window.Side = function(entity, sideName) {

  this.entity = entity;
  this.name = sideName;
  this.endpoints = [];

  this.removeEndpoint = function(endpointToDelete) {
    this.endpoints = _.reject(this.endpoints, function(endpoint) { return endpoint == endpointToDelete });
  }

  this.addEndpoint = function(endpointToAdd) {
    this.removeEndpoint(endpointToAdd);
    this.endpoints.push(endpointToAdd);
  }

  this.orientation = ({
    top:    'horizontal',
    bottom: 'horizontal',
    left:   'vertical',
    right:  'vertical'
  })[sideName];

  this.outwardVector = ({
    top:    {x: 0, y:-1},
    bottom: {x: 0, y: 1},
    left:   {x:-1, y: 0},
    right:  {x: 1, y: 0}
  })[sideName];

  this.span = ({
    horizontal: function() { return this.entity.width;  },
    vertical:   function() { return this.entity.height; },
  })[this.orientation];

  this.maxOffset = function() {
    return Math.round((this.span() - window.ARROWHEAD_WIDTH) / 2);
  }

  this.negotiateEndpoints = function() {
    // Reset bounds
    var lowerBound = -this.maxOffset();
    var upperBound =  this.maxOffset();

    // Sort endpoints by priority. When the ideal ANGLE is non-zero, it means a
    // straight-line relationship is not possible. These cases should overpower
    // straight-line cases which only have a non-zero ideal OFFSET.
    this.endpoints = _.sortBy(this.endpoints, function(endpoint) {
      endpoint.calculateIdeals();
      return -Math.abs(10000 * endpoint.idealAngle + endpoint.idealOffset);
    });

    // Place each endpoint, in priority order
    _.each(this.endpoints, function(endpoint) {

      // Ideal offset falls naturally in the allowed area -> let it be exactly there
      if(endpoint.idealOffset > lowerBound &&
         endpoint.idealOffset < upperBound) {
        endpoint.assigned_offset = endpoint.idealOffset;

      // Ideal offset is below the allowed area
      } else if (endpoint.idealOffset <= lowerBound) {
        endpoint.assigned_offset = lowerBound

      // Ideal offset is above the allowed area
      } else if (endpoint.idealOffset >= upperBound) {
        endpoint.assigned_offset = upperBound
      }

      // Assign global coordinates for use by relationship draw
      var coordinates = this.entity.sideCenterOffsetCoordinates(this.name, endpoint.assigned_offset);
      endpoint.x = coordinates.x
      endpoint.y = coordinates.y

      // Finally, close up the allowed area for the next endpoint.
      // Connection point is above center so bring down the upper bound
      if (endpoint.idealOffset > 0)
        upperBound = endpoint.assigned_offset - window.ARROWHEAD_WIDTH
      // Connection point is below center so bring up the lower bound
      else
        lowerBound = endpoint.assigned_offset + window.ARROWHEAD_WIDTH
    },this);

  };
}
