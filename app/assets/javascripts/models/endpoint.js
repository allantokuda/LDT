window.Endpoint = function(endpoint) {

  this.entity       = endpoint.entity;
  this.relationship = endpoint.relationship;
  this.label        = endpoint.label;
  this.symbol       = endpoint.symbol;
  this.otherEntity  = endpoint.otherEntity;

  // Two-way attach to one entity and one relationship, "permanently"
  // (i.e. until deleted by user command).
  this.relationship.setEndpoint(this);
  this.entity.attachEndpoint(this);

  /* LOGIC MAY NEED TO GO INTO ENDPOINT OR RELATIONSHIP CLASS
  var center_to_center = side.along(endpoint.otherEntity.center()) -
                         side.along(this.center());

  var max_straight_line_offset = (this.span(side) + endpoint.otherEntity.span(side)) / 2 - this.ARROWHEAD_WIDTH
  var ideal_offset = Math.round((this.span(side) - this.ARROWHEAD_WIDTH) / 2 *
                     center_to_center / max_straight_line_offset)
  */

  // Determine which side of the attached entity is best, and assign self there
  this.relocate = function() {
    if (this.side)
      this.side.removeEndpoint(this);

    this.side = this.entity.nearestSide(this.otherEntity);
    this.side.addEndpoint(this);
  };
}
