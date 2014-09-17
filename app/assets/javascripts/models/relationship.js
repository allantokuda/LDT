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
    d = this.endpointSyntaxData();

    this.syntaxErrors =
      this.twoBarSyntaxError(d) +
      this.oneBeSyntaxError(d) +
      this.oneLabelSyntaxError(d) +
      this.oneOneUnlabeledSyntaxError(d) +
      this.multiIdOnOneOneLinkSyntaxError(d) +
      this.singleIdOnDegreeOneLinkOfOneManyRelationshipSyntaxError(d) +
      this.multiIdOnDegreeManyLinkOfOneManyRelationshipSyntaxError(d)


    this.syntaxErrors = this.syntaxErrors.trimRight();

    return this.syntaxErrors.length > 0;
  }

  this.endpointSyntaxData = function() {
    var data = {
      id1:    !!this.endpoints[0].symbol.match('identifier'),
      id2:    !!this.endpoints[1].symbol.match('identifier'),
      one1:     this.endpoints[0].symbol == 'none' || this.endpoints[0].symbol == 'identifier',
      one2:     this.endpoints[1].symbol == 'none' || this.endpoints[1].symbol == 'identifier',
      many1:  !!this.endpoints[0].symbol.match('chickenfoot'),
      many2:  !!this.endpoints[1].symbol.match('chickenfoot'),
      label1:   this.endpoints[0].label.trim().length > 0,
      label2:   this.endpoints[1].label.trim().length > 0,
      be1:      this.endpoints[0].label.toLowerCase() == 'be',
      be2:      this.endpoints[1].label.toLowerCase() == 'be',
      atid1:  !!this.endpoints[0].entity.attributes.match("\\*$\|\\*\n"),
      atid2:  !!this.endpoints[1].entity.attributes.match("\\*$\|\\*\n"),
    }
    data.be = data.be1 || data.be2;
    data.labeled = data.label1 || data.label2;
    data.oneOne  = data.one1 && data.one2;

    return data;
  }

  this.twoBarSyntaxError = function(d) {
    return (d.id1 && d.id2) ? "ERROR: Both links of a relationship cannot contribute to identifiers.\n" : ""
  }

  this.oneBeSyntaxError = function(d) {
    return (!d.be1 != !d.be2) ? "ERROR: If one side of a relationship is 'be' then the other side also must be.\n" : ""
  }

  this.oneLabelSyntaxError = function(d) {
    return (!d.label1 != !d.label2) ? "ERROR: A relationship must have either two labels or zero labels\n" : ""
  }

  this.oneOneUnlabeledSyntaxError = function(d) {
    return (!d.labeled && d.oneOne) ? "ERROR: A one-one relationship must have labels\n" : ""
  }

  this.multiIdOnOneOneLinkSyntaxError = function(d) {
    return ((d.id1 && d.atid1 && d.oneOne) ||
            (d.id2 && d.atid2 && d.oneOne)) ? "ERROR: A multiple-descriptor identifier cannot include a link of a one-one relationship\n" : ""
  }

  this.singleIdOnDegreeOneLinkOfOneManyRelationshipSyntaxError = function(d) {
    return ((d.id1 && !d.atid1 && d.one2 && d.many1) ||
            (d.id2 && !d.atid2 && d.one1 && d.many2)) ? "ERROR: A single-descriptor identifier cannot include the degree-one link of a one-many relationship\n" : ""
  }

  this.multiIdOnDegreeManyLinkOfOneManyRelationshipSyntaxError = function(d) {
    return ((d.id1 && d.atid1 && d.one1 && d.many2) ||
            (d.id2 && d.atid2 && d.one2 && d.many1)) ? "ERROR: A multiple-descriptor identifier cannot include the degree-many link of a one-many relationship\n" : ""
  }
};
