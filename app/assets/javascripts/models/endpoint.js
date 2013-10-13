window.Endpoint = function(endpoint) {

  this.class='Endpoint'
  this.OUTWARD_VECTOR_MAP = {
    top:    {x: 0, y:-1},
    bottom: {x: 0, y: 1},
    left:   {x:-1, y: 0},
    right:  {x: 1, y: 0}
  }

  this.entity       = endpoint.entity;
  this.otherEntity  = endpoint.otherEntity;
  this.label        = endpoint.label  || '';
  this.symbol       = endpoint.symbol || '?';

  this.parallelCoordinate = function(point) {
    return ({
      top:    point.x,
      bottom: point.x,
      left:   point.y,
      right:  point.y,
    })[this.sideName];
  }

  this.getMaxOffset = function() {
    return Math.round(
      (this.entity.span(this.sideName) - window.ARROWHEAD_WIDTH) / 2
    );
  }

  this.calculateIdeals = function() {

    var thisSpan   = this        .entity.span(this.sideName);
    var thatSpan   = this.partner.entity.span(this.sideName); //assuming rectangular
    var thisCenter = this.parallelCoordinate(this.entity.center());
    var thatCenter = this.parallelCoordinate(this.otherEntity.center());
    var maxOffset = this.getMaxOffset();

    var center_to_center = thatCenter - thisCenter;
    var max_center_to_center = (thisSpan + thatSpan) / 2 - window.ARROWHEAD_WIDTH

    var flatLineOffset = Math.round(
      (thisSpan - window.ARROWHEAD_WIDTH) / 2 *
      center_to_center / max_center_to_center
    );

    function sign(x) { return x ? (x < 0 ? -1 : 1) : 0; }

    // Flat line relationship
    if (Math.abs(flatLineOffset) <= maxOffset) {
      this.idealOffset = flatLineOffset;
      this.idealAngle = 0;
    // Zig-zag relationship
    } else {
      this.idealOffset = sign(flatLineOffset) * maxOffset;
      var stretch = Math.abs(this.idealOffset - flatLineOffset);
      var distance = this.entity.outwardDistance(this.sideName, this.otherEntity);
      this.idealAngle = Math.atan2(stretch, distance - window.ARROWHEAD_LENGTH * 2) * 180 / 3.1416
    }
  };


  // Determine which side of the attached entity is best, and assign self there
  this.relocate = function() {
    var targetSideName;

    targetSideName = this.entity.nearestSide(this.otherEntity);

    if (targetSideName != this.sideName) {
      this.sideName = targetSideName;
      this.entity.addEndpoint(this, this.sideName);
      this.outwardVector = this.OUTWARD_VECTOR_MAP[this.sideName];
    }
  };

  this.siblings = function() {
    return this.entity.endpoints[this.sideName];
  }

  this.fullSiblings = function() {
    return _.filter(this.siblings(), function(endpoint) {
      return endpoint.otherEntity == this.otherEntity;
    }, this);
  }

  this.negotiateCoordinates = function() {
    // Reset bounds
    var maxOffset = this.getMaxOffset();
    var lowerBound = -maxOffset;
    var upperBound =  maxOffset;

    var siblings = this.siblings();

    // Sort endpoints by priority. When the ideal ANGLE is non-zero, it means a
    // straight-line relationship is not possible. These cases should overpower
    // straight-line cases which only have a non-zero ideal OFFSET.
    siblings = _.sortBy(siblings, function(endpoint) {
      endpoint.calculateIdeals();
      return -Math.abs(10000 * endpoint.idealAngle + endpoint.idealOffset);
    });

    // Place each endpoint, in priority order
    _.each(siblings, function(endpoint) {

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
      var coordinates = this.entity.sideCenterOffsetCoordinates(this.sideName, endpoint.assigned_offset);
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

  this.arrowheadPath = function() {
    return "M" + this.x + ',' + this.y + window.arrowheadSVG[this.symbol][this.sideName];
  }

  this.boxPath = function() {
    return "M" + this.x + ',' + this.y + window.arrowheadSVG['box'][this.sideName];
  }

  this.toggleArrowhead = function(toggleIdentifier) {
    if (toggleIdentifier) {
      switch(this.symbol) {
        case 'none':                   this.symbol = 'identifier'; break;
        case 'identifier':             this.symbol = 'none'; break;
        case 'chickenfoot':            this.symbol = 'chickenfoot_identifier'; break;
        case 'chickenfoot_identifier': this.symbol = 'chickenfoot'; break;
        case '?':                      this.symbol = 'identifier'; break;
      }
    } else {
      switch(this.symbol) {
        case 'none':                   this.symbol = 'chickenfoot'; break;
        case 'chickenfoot':            this.symbol = 'none'; break;
        case 'identifier':             this.symbol = 'chickenfoot_identifier'; break;
        case 'chickenfoot_identifier': this.symbol = 'identifier'; break;
        case '?':                      this.symbol = 'none'; break;
      }
    }
  }
}
