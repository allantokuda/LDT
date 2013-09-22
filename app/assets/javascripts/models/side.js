window.SIDENAMES = ['top', 'bottom', 'left', 'right'];

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

  this.outwardDistance = ({
    left:   function(other) { return this.entity.x - other.x - other.width  },
    top:    function(other) { return this.entity.y - other.y - other.height },
    right:  function(other) { return other.x - this.entity.x - this.entity.width  },
    bottom: function(other) { return other.y - this.entity.y - this.entity.height }
  })[sideName];

  this.span = ({
    horizontal: function() { return this.entity.width;  },
    vertical:   function() { return this.entity.height; },
  })[this.orientation];

  this.centerOffsetCoordinates = ({
    horizontal: function(offset) { return { x: this.entity.x + this.entity.width  / 2 + offset, y: this.entity.y + this.entity.height }; },
    vertical:   function(offset) { return { y: this.entity.y + this.entity.height / 2 + offset, x: this.entity.x + this.entity.width  }; }
  })[this.orientation];

  this.along = ({
    horizontal: function(point) { return point.x; },
    vertical:   function(point) { return point.y; },
  })[this.orientation];

  this.maxOffset = function() {
    return (this.span - this.ARROWHEAD_WIDTH) / 2;
  }

  this.negotiateEndpoints = function() {
    // Reset bounds
    var lowerBound = -this.maxOffset();
    var upperBound =  this.maxOffset();

    // Sort endpoints by priority
    this.endpoints = _.sortBy(this.endpoints, function(endpoint) {
      return -Math.abs(endpoint.ideal_offset)
    });

    // Place each endpoint, in priority order
    _.each(this.endpoints, _.bind(function(endpoint) {

      // Ideal offset falls naturally in the allowed area -> let it be exactly there
      if(endpoint.ideal_offset > lowerBound &&
         endpoint.ideal_offset < upperBound) {
        endpoint.assigned_offset = endpoint.ideal_offset;

      // Ideal offset is below the allowed area
      } else if (endpoint.ideal_offset <= lowerBound) {
        endpoint.assigned_offset = lowerBound

      // Ideal offset is above the allowed area
      } else if (endpoint.ideal_offset >= upperBound) {
        endpoint.assigned_offset = upperBound
      }

      // Assign global coordinates for use by relationsihp draw
      var coordinates = this.centerOffsetCoordinates(endpoint.assigned_offset);
      endpoint.x = coordinates.x
      endpoint.y = coordinates.y

      // Finally, close up the allowed area for the next endpoint.
      // Connection point is above center so bring down the upper bound
      if (endpoint.ideal_offset > 0)
        upperBound = endpoint.assigned_offset - this.ARROWHEAD_WIDTH
      // Connection point is below center so bring up the lower bound
      else
        lowerBound = endpoint.assigned_offset + this.ARROWHEAD_WIDTH
    },this));

  };
}
