'use strict';

window.Relationship = function(id, entity1, entity2) {
  self = this;

  this.id = id;
  this.entity1_id = entity1.id;
  this.entity2_id = entity2.id;

  this.endpoints = [
    new window.Endpoint({}),
    new window.Endpoint({})
  ];
  this.syntaxErrors = "";

  function svgPolyline(points) {
    if (points.length >= 2) {
      return "M" + _.map(points, function(point) {
        return Math.round(point.x) + ',' + Math.round(point.y);
      }).join(' L');
    }
  }

  this.svgPath = function() {

    var arrowBases = _.map(this.endpoints, function(tip) {
      return {
        x: (tip.x + tip.outwardVector.x * ARROWHEAD_LENGTH),
        y: (tip.y + tip.outwardVector.y * ARROWHEAD_LENGTH)
      };
    }.bind(this));

    return svgPolyline([this.endpoints[0], arrowBases[0], arrowBases[1], this.endpoints[1]]);
  };

  this.saveObject = function() {
    return {
      id         : this.id,
      entity1_id : this.entity1_id,
      entity2_id : this.entity2_id,
      symbol1    : this.endpoints[0].symbol,
      symbol2    : this.endpoints[1].symbol,
      label1     : this.endpoints[0].label,
      label2     : this.endpoints[1].label
    };
  };

  this.place = function(point1, point2) {
    var ep1, ep2;

    ep1 = this.endpoints[0];
    ep2 = this.endpoints[1];

    ep1.x = point1.x;
    ep1.y = point1.y;
    ep1.sideName = point1.side;
    ep1.setOutwardVector();

    ep2.x = point2.x;
    ep2.y = point2.y;
    ep2.sideName = point2.side;
    ep2.setOutwardVector();
  };

  this.syntaxError = function() {
    var d = this.endpointSyntaxData();

    this.syntaxErrors =
      this.twoBarSyntaxError(d) +
      this.oneBeSyntaxError(d) +
      this.oneLabelSyntaxError(d) +
      this.oneOneUnlabeledSyntaxError(d)
      //this.multiIdOnOneOneLinkSyntaxError(d) +
      //this.singleIdOnDegreeOneLinkOfOneManyRelationshipSyntaxError(d) +
      //this.multiIdOnDegreeManyLinkOfOneManyRelationshipSyntaxError(d) +
      //this.unlabledReflexiveSyntaxError(d) +
      //this.reflexiveInIdentifierSyntaxError(d)


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
      //atid1:  !!this.endpoints[0].entity.attributes.match("\\*$\|\\*\n"),
      //atid2:  !!this.endpoints[1].entity.attributes.match("\\*$\|\\*\n"),
      //reflex:   this.endpoints[0].entity.id == this.endpoints[1].entity.id,
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

/*
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

  this.unlabledReflexiveSyntaxError = function(d) {
    return (!d.labeled && d.reflex) ? "ERROR: All reflexive relationships must have labels" : ""
  }

  this.reflexiveInIdentifierSyntaxError = function(d) {
    return (d.reflex && (d.id1 || d.id2)) ? "ERROR: No link of a reflexive relationship can contribute to an identifier" : ""
  }
*/
};
