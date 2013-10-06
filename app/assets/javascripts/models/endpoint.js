window.Endpoint = function(endpoint) {

  this.OUTWARD_VECTOR_MAP = {
    top:    {x: 0, y:-1},
    bottom: {x: 0, y: 1},
    left:   {x:-1, y: 0},
    right:  {x: 1, y: 0}
  }

  this.entity       = endpoint.entity;
  this.otherEntity  = endpoint.otherEntity;
  this.relationship = endpoint.relationship;
  this.label        = endpoint.label;
  this.symbol       = endpoint.symbol;

  // Two-way attach to one entity and one relationship, "permanently"
  // (i.e. until deleted by user command).
  this.relationship.setEndpoint(this);

  this.parallelCoordinate = function(point) {
    return ({
      top:    point.x,
      bottom: point.x,
      left:   point.y,
      right:  point.y,
    })[this.sideName];
  };

  this.calculateIdeals = function() {

    var maxOffset  = this.side.maxOffset();
    var thisSpan   = this.side.span();
    var thatSpan   = this.partner.side.span();
    var thisCenter = this.parallelCoordinate(this.entity.center());
    var thatCenter = this.parallelCoordinate(this.otherEntity.center());

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
      var distance = this.entity.outwardDistance(this.side.name, this.otherEntity);
      this.idealAngle = Math.atan2(stretch, distance - window.ARROWHEAD_LENGTH * 2) * 180 / 3.1416
    }
  };


  // Determine which side of the attached entity is best, and assign self there
  this.relocate = function() {
    if (this.side)
      this.side.removeEndpoint(this);

    this.side = this.entity.nearestSide(this.otherEntity);
    this.side.addEndpoint(this);

    this.sideName = this.side.name

    this.outwardVector = this.OUTWARD_VECTOR_MAP[this.sideName];
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
