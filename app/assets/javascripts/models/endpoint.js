window.Endpoint = function(relationship, entity, label, symbol) {

  this.entity = entity;
  this.relationship = relationship;
  this.label = label;
  this.symbol = symbol;
  this.other_entity = relationship.other(entity)

  var side = this.nearestSide(other_entity);

  /* LOGIC MAY NEED TO GO INTO ENDPOINT OR RELATIONSHIP CLASS
  var center_to_center = side.along(endpoint.other_entity.center()) -
                         side.along(this.center());

  var max_straight_line_offset = (this.span(side) + endpoint.other_entity.span(side)) / 2 - this.ARROWHEAD_WIDTH
  var ideal_offset = Math.round((this.span(side) - this.ARROWHEAD_WIDTH) / 2 *
                     center_to_center / max_straight_line_offset)
  */

  //Store endpoint in entity and also return it for reference by the relationship

  // Determine which side of the attached entity is best, and assign self there
  var relocate = function() {
  };
}
