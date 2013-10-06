window.Endpoint = function(endpoint) {

  this.entity       = endpoint.entity;
  this.otherEntity  = endpoint.otherEntity;
  this.relationship = endpoint.relationship;
  this.label        = endpoint.label;
  this.symbol       = endpoint.symbol;

  // Two-way attach to one entity and one relationship, "permanently"
  // (i.e. until deleted by user command).
  this.relationship.setEndpoint(this);

  this.calculateIdeals = function() {

    var maxOffset  = this.side.maxOffset();
    var thisSpan   = this.side.span();
    var thatSpan   = this.partner.side.span();
    var thisCenter = this.side.parallelCoordinate(this.entity.center());
    var thatCenter = this.side.parallelCoordinate(this.otherEntity.center());

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
      var distance = this.side.outwardDistance(this.otherEntity);
      this.idealAngle = Math.atan2(stretch, distance - window.ARROWHEAD_LENGTH * 2) * 180 / 3.1416
    }
  };


  // Determine which side of the attached entity is best, and assign self there
  this.relocate = function() {
    if (this.side)
      this.side.removeEndpoint(this);

    this.side = this.entity.nearestSide(this.otherEntity);
    this.side.addEndpoint(this);
  };
}
