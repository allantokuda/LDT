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

    function summaryOfPairsOnEntity(entity) {
      var pairs = service.pairsOnEntity(entity);
      var result = [];
      for (var i in pairs) {
        result.push([
          pairs[i].entity1.id,
          pairs[i].entity2.id
        ]);
      }
      return result;
    }

    expect(summaryOfPairsOnEntity(e1)).toEqual([]);
    expect(summaryOfPairsOnEntity(e2)).toEqual([]);
    expect(summaryOfPairsOnEntity(e3)).toEqual([]);

    service.addRelationship(r1);
    service.addRelationship(r2);
    service.addRelationship(r3);

    expect(summaryOfPairsOnEntity(e1)).toEqual([[1,2],[1,3]]);
    expect(summaryOfPairsOnEntity(e2)).toEqual([[1,2],[2,3]]);
    expect(summaryOfPairsOnEntity(e3)).toEqual([[1,3],[2,3]]);

    service.removeRelationship(r3);

    expect(summaryOfPairsOnEntity(e1)).toEqual([[1,2],[1,3]]);
    expect(summaryOfPairsOnEntity(e2)).toEqual([[1,2]]);
    expect(summaryOfPairsOnEntity(e3)).toEqual([[1,3]]);

  });
});
