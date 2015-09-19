'use strict';

angular.module('LDT.controllers').service('SyntaxAnalyzer', ['GraphStore', function(GraphStore) {

  this.getRelationshipAnnotations = function() {
    return GraphStore.getAllRelationships().map(function(relationship) {
      var r = shorthandRelationship(relationship);
      var errors = relationshipSyntaxErrors(r);
      console.log(errors);

      return {
        isError: errors.length > 0,
        svgPath: relationship.svgPath(),
        annotationMessages: errors
      }
    });
  }

  function shorthandRelationship(relationship) {
    var r = {
      id1:    !!relationship.endpoints[0].symbol.match('identifier'),
      id2:    !!relationship.endpoints[1].symbol.match('identifier'),
      one1:     relationship.endpoints[0].symbol == 'none' || relationship.endpoints[0].symbol == 'identifier',
      one2:     relationship.endpoints[1].symbol == 'none' || relationship.endpoints[1].symbol == 'identifier',
      many1:  !!relationship.endpoints[0].symbol.match('chickenfoot'),
      many2:  !!relationship.endpoints[1].symbol.match('chickenfoot'),
      label1:   relationship.endpoints[0].label.trim().length > 0,
      label2:   relationship.endpoints[1].label.trim().length > 0,
      be1:      relationship.endpoints[0].label.toLowerCase() == 'be',
      be2:      relationship.endpoints[1].label.toLowerCase() == 'be',
      atid1:    isEntityPartiallyIdentifiedByAnyOfItsAttributes(relationship.entity1_id),
      atid2:    isEntityPartiallyIdentifiedByAnyOfItsAttributes(relationship.entity2_id),
      reflex:   relationship.entity1_id == relationship.entity2_id,
    }

    r.be = r.be1 || r.be2;
    r.labeled = r.label1 || r.label2;
    r.oneOne  = r.one1 && r.one2;

    return r;
  }

  function relationshipSyntaxErrors(r) {
    return (
      twoBarSyntaxError(r) +
      oneBeSyntaxError(r) +
      oneLabelSyntaxError(r) +
      oneOneUnlabeledSyntaxError(r) +
      multiIdOnOneOneLinkSyntaxError(r) +
      singleIdOnDegreeOneLinkOfOneManyRelationshipSyntaxError(r) +
      multiIdOnDegreeManyLinkOfOneManyRelationshipSyntaxError(r) +
      unlabledReflexiveSyntaxError(r) +
      reflexiveInIdentifierSyntaxError(r)
    ).trimRight();
  }


  function isEntityPartiallyIdentifiedByAnyOfItsAttributes(entityId) {
    return !!GraphStore.getEntity(entityId).attributes.match("\\*$\|\\*\n");
  }

  function twoBarSyntaxError(r) {
    return (r.id1 && r.id2) ? "ERROR: Both links of a relationship cannot contribute to identifiers.\n" : ""
  }

  function oneBeSyntaxError(r) {
    return (!r.be1 != !r.be2) ? "ERROR: If one side of a relationship is 'be' then the other side also must be.\n" : ""
  }

  function oneLabelSyntaxError(r) {
    return (!r.label1 != !r.label2) ? "ERROR: A relationship must have either two labels or zero labels.\n" : ""
  }

  function oneOneUnlabeledSyntaxError(r) {
    return (!r.labeled && r.oneOne) ? "ERROR: A one-one relationship must have labels.\n" : ""
  }

  function multiIdOnOneOneLinkSyntaxError(r) {
    return ((r.id1 && r.atid1 && r.oneOne) ||
            (r.id2 && r.atid2 && r.oneOne)) ? "ERROR: A multiple-descriptor identifier cannot include a link of a one-one relationship.\n" : ""
  }

  function singleIdOnDegreeOneLinkOfOneManyRelationshipSyntaxError(r) {
    return ((r.id1 && !r.atid1 && r.one2 && r.many1) ||
            (r.id2 && !r.atid2 && r.one1 && r.many2)) ? "ERROR: A single-descriptor identifier cannot include the degree-one link of a one-many relationship.\n" : ""
  }

  function multiIdOnDegreeManyLinkOfOneManyRelationshipSyntaxError(r) {
    return ((r.id1 && r.atid1 && r.one1 && r.many2) ||
            (r.id2 && r.atid2 && r.one2 && r.many1)) ? "ERROR: A multiple-descriptor identifier cannot include the degree-many link of a one-many relationship.\n" : ""
  }

  function unlabledReflexiveSyntaxError(r) {
    return (!r.labeled && r.reflex) ? "ERROR: All reflexive relationships must have labels.\n" : ""
  }

  function reflexiveInIdentifierSyntaxError(r) {
    return (r.reflex && (r.id1 || r.id2)) ? "ERROR: No link of a reflexive relationship can contribute to an identifier.\n" : ""
  }
}]);
