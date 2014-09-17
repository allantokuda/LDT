window.Relationship = function(id, entity1, entity2) {

  this.id = id;
  this.endpoints = [
    new window.Endpoint({ entity: entity1, otherEntity: entity2 }),
    new window.Endpoint({ entity: entity2, otherEntity: entity1 })
  ];
  this.endpoints[0].partner = this.endpoints[1];
  this.endpoints[1].partner = this.endpoints[0];
  this.syntaxErrors = "";

  this.svgPath = function() {

    var arrowTip = [];
    arrowTip[0] = this.endpoints[0];
    arrowTip[1] = this.endpoints[1];

    var arrowBase = _.map(arrowTip, function(tip) {
      return {
        x: (tip.x + tip.outwardVector.x * ARROWHEAD_LENGTH),
        y: (tip.y + tip.outwardVector.y * ARROWHEAD_LENGTH)
      };
    });

    function svgPolyline(points) {
      if (points.length >= 2)
        return "M" + _.map(points, function(point) {
          return Math.round(point.x) + ',' + Math.round(point.y);
        }).join(' L');
    }

    return svgPolyline([arrowTip[0], arrowBase[0], arrowBase[1], arrowTip[1]]);
  };

  this.saveObject = function() {
    return {
      id         : this.id,
      entity1_id : this.endpoints[0].entity.id,
      entity2_id : this.endpoints[1].entity.id,
      symbol1    : this.endpoints[0].symbol,
      symbol2    : this.endpoints[1].symbol,
      label1     : this.endpoints[0].label,
      label2     : this.endpoints[1].label
    };
  };

  this.syntaxError = function() {
    result = false;
    this.syntaxErrors =
      this.twoBarSyntaxError() +
      this.oneBeSyntaxError() +
      this.oneLabelSyntaxError() +
      this.oneOneUnlabeledSyntaxError()

    this.syntaxErrors = this.syntaxErrors.trimRight();

    return this.syntaxErrors.length > 0;
  }

  this.twoBarSyntaxError = function() {
    var id1 = this.endpoints[0].symbol.match('identifier');
    var id2 = this.endpoints[1].symbol.match('identifier');
    return (id1 && id2) ? "ERROR: Both links of a relationship cannot contribute to identifiers.\n" : ""
  }

  this.oneBeSyntaxError = function() {
    var be1 = (this.endpoints[0].label.toLowerCase() == 'be');
    var be2 = (this.endpoints[1].label.toLowerCase() == 'be');
    return (!be1 != !be2) ? "ERROR: If one side of a relationship is 'be' then the other side also must be.\n" : ""
  }

  this.oneLabelSyntaxError = function() {
    var label1 = (this.endpoints[0].label.trim().length > 0);
    var label2 = (this.endpoints[1].label.trim().length > 0);
    return (!label1 != !label2) ? "ERROR: A relationship must have either two labels or zero labels\n" : ""
      // XOR
  }

  this.oneOneUnlabeledSyntaxError = function() {
    var label1 = (this.endpoints[0].label.trim().length > 0);
    var label2 = (this.endpoints[1].label.trim().length > 0);
    var one1   = (this.endpoints[0].symbol == 'none');
    var one2   = (this.endpoints[1].symbol == 'none');
    /*
    var many1  = (this.endpoints[0].symbol.match('chickenfoot'));
    var many2  = (this.endpoints[1].symbol.match('chickenfoot'));
    */
    return (!label1 && !label2 && one1 && one2) ? "ERROR: A one-one relationship must have labels\n" : ""
  }
};
