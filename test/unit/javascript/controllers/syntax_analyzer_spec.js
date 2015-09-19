'use strict';

describe('SyntaxAnalyzer', function(){
  var GraphStore, SyntaxAnalyzer, entity1, entity2, entities, relationship, relationships, endpoint1, endpoint2;

  beforeEach(module('LDT.controllers'));
  beforeEach(inject(function (_GraphStore_, _SyntaxAnalyzer_) {

    entity1 = {
      name: 'a',
      attributes: "aaa*\naaa1\naaa2"
    };

    entity2 = {
      name: 'b',
      attributes: "bbb*\nbbb1\nbbb2"
    };

    entities = [entity1, entity2];

    endpoint1 = {
      symbol: 'none',
      label: ''
    };

    endpoint2 = {
      symbol: 'chickenfoot_identifier',
      label: ''
    };

    relationship = {
      entity1_id: 0,
      entity2_id: 1,
      svgPath: function() { return '' },
      endpoints: [endpoint1, endpoint2]
    }

    relationships = [relationship];

    GraphStore = _GraphStore_;
    SyntaxAnalyzer = _SyntaxAnalyzer_;
    spyOn(GraphStore, 'getEntity').andCallFake(function(entityId) {
      return entities[entityId];
    });
    spyOn(GraphStore, 'getAllRelationships').andCallFake(function() {
      return relationships;
    });
  }));

  it('should not annotate an empty graph', function() {
    entities = [];
    relationships = [];
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a.length).toBe(0);
    expect(a.length).toBe(0);
  });

  it('should not annotate an clean graph', function() {
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a.length).toBe(1);
    expect(a[0].isError).toBe(false);
  });

  it('twoBarSyntaxError', function() {
    endpoint1.symbol = 'identifier'
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("Both links of a relationship cannot contribute to identifiers");
  });

  it('oneBeSyntaxError', function() {
    endpoint1.label = 'be'
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("If one side of a relationship is 'be' then the other side also must be");
  });

  it('oneLabelSyntaxError', function() {
    endpoint1.label = 'some label'
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("A relationship must have either two labels or zero labels.");
  });

  it('oneOneUnlabeledSyntaxError', function() {
    endpoint1.symbol = 'none';
    endpoint2.symbol = 'none';
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("A one-one relationship must have labels");
  });

  it('multiIdOnOneOneLinkSyntaxError', function() {
    endpoint1.symbol = 'identifier';
    endpoint2.symbol = 'none';
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("A multiple-descriptor identifier cannot include a link of a one-one relationship");
  });

  it('singleIdOnDegreeOneLinkOfOneManyRelationshipSyntaxError', function() {
    entity1.attributes = "aaa\naaa1\naaa2";
    endpoint1.symbol = 'chickenfoot_identifier';
    endpoint2.symbol = 'none';
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("A single-descriptor identifier cannot include the degree-one link of a one-many relationship");
  });

  it('multiIdOnDegreeManyLinkOfOneManyRelationshipSyntaxError', function() {
    endpoint1.symbol = 'identifier';
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("A multiple-descriptor identifier cannot include the degree-many link of a one-many relationship");
  });

  it('unlabledReflexiveSyntaxError', function() {
    relationship.entity1_id = 1;
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("All reflexive relationships must have labels");
  });

  it('reflexiveInIdentifierSyntaxError', function() {
    relationship.entity1_id = 1;
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("No link of a reflexive relationship can contribute to an identifier");
  });
});
