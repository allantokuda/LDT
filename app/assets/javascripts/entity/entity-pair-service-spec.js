'use strict';

describe('Entity pair service', function() {
  var service, entity1, entity2, entity3, sibling1, sibling2, halfSibling;

  beforeEach(module('LDT.entity'));
  beforeEach(inject(function(EntityPairService) {
    var e1 = { id: 1, x:   0, y:   0, width: 100, height: 130 }
    var e2 = { id: 2, x: 250, y: 120, width: 100, height: 150 }
    var e3 = { id: 3, x: 250, y: 420, width: 100, height: 150 }
    sibling1    = { id: 1, entity1: e1, entity2: e2 }
    sibling2    = { id: 2, entity1: e1, entity2: e2 }
    halfSibling = { id: 3, entity1: e1, entity2: e3 }

    service = EntityPairService;
  }));

  //extract just the entity IDs for simplified testing
  function summarize(pairs) {
    var result = [];
    for (var i in pairs) {
      result.push([
        pairs[i].entity1.id,
        pairs[i].entity2.id
      ]);
    }
    return result;
  }

  it('initially has 0 pairs', function() {
    expect(service.count()).toEqual(0);
  });

  it('accepts a relationship, and has 1 pair', function() {
    service.addRelationship(sibling1);
    expect(service.pairs).toBeDefined();
    expect(service.pairs.length).toBe(1);
    expect(service.pairs[0].entity1.id).toBe(1);
    expect(service.pairs[0].entity2.id).toBe(2);
    expect(service.pairs[0].relationships.length).toBe(1);
  });

  it('accepts two relationships, and has two pairs', function() {
    service.addRelationship(sibling1);
    service.addRelationship(halfSibling);
    expect(service.pairs.length).toBe(2);
    expect(service.pairs[0].entity1.id).toBe(1);
    expect(service.pairs[0].entity2.id).toBe(2);
    expect(service.pairs[0].relationships.length).toBe(1);
    expect(service.pairs[1].entity1.id).toBe(1);
    expect(service.pairs[1].entity2.id).toBe(3);
    expect(service.pairs[1].relationships.length).toBe(1);
  });

  it('accepts two sibling relationships, and has only one pair', function() {
    service.addRelationship(sibling1);
    service.addRelationship(sibling2);
    expect(service.pairs.length).toBe(1);
    expect(service.pairs[0].entity1.id).toBe(1);
    expect(service.pairs[0].entity2.id).toBe(2);
    expect(service.pairs[0].relationships.length).toBe(2);
  });

  it('accepts two sibling relationships and a half-sibling, and has two pairs', function() {
    service.addRelationship(sibling1);
    service.addRelationship(sibling2);
    service.addRelationship(halfSibling);
    expect(service.pairs.length).toBe(2);
    expect(service.pairs[0].entity1.id).toBe(1);
    expect(service.pairs[0].entity2.id).toBe(2);
    expect(service.pairs[0].relationships.length).toBe(2);
    expect(service.pairs[1].entity1.id).toBe(1);
    expect(service.pairs[1].entity2.id).toBe(3);
    expect(service.pairs[1].relationships.length).toBe(1);
  });

  it('happily accepts a large number of relationships', function() {
    var e1 = { id: 1 };
    var e2 = { id: 2 };
    var e3 = { id: 3 };

    // Lots of siblings and half-siblings
    for (var i=0; i<10000; i++) {
      service.addRelationship({entity1_id: 1, entity2_id: 2, entity1: e1, entity2: e2 });
      service.addRelationship({entity1_id: 1, entity2_id: 3, entity1: e1, entity2: e3 });
    }

    expect(service.pairs.length).toBe(2);
  });

  it('allows relationships to be removed', function() {
    service.addRelationship(sibling1);
    service.addRelationship(sibling2);
    expect(service.pairs.length).toBe(1);
    service.removeRelationship(sibling1);
    expect(service.pairs.length).toBe(1);
    service.removeRelationship(sibling2);
    expect(service.pairs.length).toBe(0);
  });

  it('keeps track of the pairs each entity belongs to', function() {
    var e1 = { id: 1 }
    var e2 = { id: 2 }
    var e3 = { id: 3 }
    var r1 = { id: 1, entity1: e1, entity2: e2 }
    var r2 = { id: 2, entity1: e1, entity2: e3 }
    var r3 = { id: 3, entity1: e2, entity2: e3 }

    expect(summarize(service.pairsOnEntity(e1))).toEqual([]);
    expect(summarize(service.pairsOnEntity(e1))).toEqual([]);
    expect(summarize(service.pairsOnEntity(e1))).toEqual([]);

    service.addRelationship(r1);
    service.addRelationship(r2);
    service.addRelationship(r3);

    expect(summarize(service.pairsOnEntity(e1))).toEqual([[1,2],[1,3]]);
    expect(summarize(service.pairsOnEntity(e2))).toEqual([[1,2],[2,3]]);
    expect(summarize(service.pairsOnEntity(e3))).toEqual([[1,3],[2,3]]);

    service.removeRelationship(r3);

    expect(summarize(service.pairsOnEntity(e1))).toEqual([[1,2],[1,3]]);
    expect(summarize(service.pairsOnEntity(e2))).toEqual([[1,2]]);
    expect(summarize(service.pairsOnEntity(e3))).toEqual([[1,3]]);
  });

  it('reports the pairs that would be affected by the movement of a set of entities', function() {
    // Create chain of entities. When e0 is moved, relationships touching e1 should be affected
    var e0 = { id: 0 };
    var e1 = { id: 1 }; var r1 = { id: 1, entity1: e0, entity2: e1 };
    var e2 = { id: 2 }; var r2 = { id: 2, entity1: e1, entity2: e2 };
    var e3 = { id: 3 }; var r3 = { id: 3, entity1: e2, entity2: e3 };

    service.addRelationship(r1);
    service.addRelationship(r2);
    service.addRelationship(r3);

    var affected0 = service.pairsAffectedByMove([e0]);
    var affected1 = service.pairsAffectedByMove([e1]);

    expect(summarize(affected0)).toEqual([[1, 2], [0, 1]]);
    expect(summarize(affected1)).toEqual([[2, 3], [1, 2], [0, 1]]);
  });
});
