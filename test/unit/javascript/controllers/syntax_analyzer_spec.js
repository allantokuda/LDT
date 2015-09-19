'use strict';

describe('SyntaxAnalyzer', function(){
  var GraphStore, SyntaxAnalyzer, entity1, entity2, entities, relationship, relationships, endpoint1, endpoint2;

  beforeEach(module('LDT.controllers'));
  beforeEach(inject(function (_GraphStore_, _SyntaxAnalyzer_) {

    entity1 = new Entity({
      name: 'a',
      attributes: "a_identifier*\na_non_id1\na_non_id2"
    });

    entity2 = new Entity({
      name: 'b',
      attributes: "b_identifier*\nb_non_id1\nb_non_id2"
    });

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

    entity1.attachRelationship(relationship);
    entity2.attachRelationship(relationship);

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

  it('should not annotate an error-free graph', function() {
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

  it('reflexiveToBeSyntaxError', function() {
    relationship.entity1_id = 1;
    relationship.entity2_id = 1;
    endpoint1.symbol = 'none'
    endpoint2.symbol = 'chickenfoot'
    endpoint1.label = 'be'
    endpoint2.label = 'be'
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("No reflexive relationship is a to-be relationship");
  });

  it('considers all attached relationships in determining whether an entity has multiple descriptors', function() {

    var endpoint3 = {
      symbol: 'chickenfoot',
      label: ''
    };

    var r2 = {
      entity1_id: 0,
      entity2_id: 1,
      svgPath: function() { return '' },
      endpoints: [endpoint1, endpoint3]
    };

    relationships.push(r2);
    entity1.attachRelationship(r2);
    entity2.attachRelationship(r2);

    entity2.attributes = 'non_identifier1\nnon_identifier2';

    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(true);
    expect(a[0].annotationMessage).toMatch("A single-descriptor identifier cannot include the degree-one link of a one-many relationship");

    endpoint3.symbol = 'chickenfoot_identifier';

    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(false);
  });

  it('warns about many-many relationships', function() {
    endpoint1.symbol = 'chickenfoot';
    endpoint2.symbol = 'chickenfoot';
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(false);
    expect(a[0].isWarning).toBe(true);
    expect(a[0].annotationMessage).toMatch("The many-many relationship is a rare shape. Consider evolving into an intersection entity");
  });

  it('warns about one-many collection entities', function() {
    endpoint1.symbol = 'identifier';
    endpoint2.symbol = 'chickenfoot';
    entity1.attributes = 'non_identifier'
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(false);
    expect(a[0].isWarning).toBe(true);
    expect(a[0].annotationMessage).toMatch("The one-many collection entity is a rare shape");
  });

  it('warns about many-many collection entities', function() {
    endpoint1.symbol = 'chickenfoot_identifier';
    endpoint2.symbol = 'chickenfoot';
    entity1.attributes = 'non_identifier'
    var a = SyntaxAnalyzer.getRelationshipAnnotations();
    expect(a[0].isError).toBe(false);
    expect(a[0].isWarning).toBe(true);
    expect(a[0].annotationMessage).toMatch("The many-many collection entity is a rare shape");
  });

  //TODO errors to cover:
  //"Within any LDS, each entity, attribute, relationship and link has an official name that is unique."
  //"Between any pair of entities, there is at most one to-be relationship."
  //"Between any pair of entities, there is at most one unlabeled relationship."
  //"Each entity has at least one identifier."
  //"No identifier can be a strict subset of another."
  //"The LDS cannot contain any cycles of identification dependency."
});
