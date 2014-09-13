'use strict';

describe('Entity Pair', function() {
  var EntityPair;

  beforeEach(module('LDT.entity'));
  beforeEach(inject(function(_EntityPair_) {
    EntityPair = _EntityPair_;
  }));

  it('knows whether connecting relationships should be aligned vertically or horizontally', function() {
    var e1 = { id: 1, x:   0, y:   0, width: 100, height: 130 };
    var e2 = { id: 2, x: 250, y: 120, width: 100, height: 150 };
    var e3 = { id: 3, x: 250, y: 420, width: 100, height: 150 };
    var pair1 = new EntityPair(e1, e2); // best connected by horizontal relationship
    var pair2 = new EntityPair(e1, e3); // diagonal but slightly better connected by vertical relationship
    expect(pair1.orientation).toEqual(0); // 0: horizontal
    expect(pair2.orientation).toEqual(1); // 1: vertical
  });

  it('calculates the vertical overlap range of an offset pair', function() {
    // entities overlap in coordinates from y=120 to y=130
    var e1 = { id: 1, x:   0, y:   0, width: 100, height: 130 };
    var e2 = { id: 2, x: 250, y: 120, width: 100, height: 150 };
    var pair = new EntityPair(e1, e2);
    expect(pair.overlapRange).toEqual([120, 130]);
  });

  it('calculates the vertical overlap range of a centered pair', function() {
    // vertically centered on each other, different sizes.
    // entities overlap in coordinates from y=10 to y=120
    var e1 = { id: 1, x:   0, y:   0, width: 100, height: 130 };
    var e2 = { id: 3, x: 500, y:  10, width: 100, height: 110 };
    var pair = new EntityPair(e1, e2);
    expect(pair.overlapRange).toEqual([10, 120]);
  });

  it('calculates the vertical overlap midpoint of the pair', function() {
    // entities overlap in coordinates from y=120 to y=130
    var e1 = { id: 1, x:   0, y:   0, width: 100, height: 130 };
    var e2 = { id: 2, x: 250, y: 120, width: 100, height: 150 };
    var pair = new EntityPair(e1, e2);
    expect(pair.overlapMidpoint).toEqual(125);
  });

  it('returns overlap range and midpoint as undefined when there is no overlap in X or Y', function() {
    var e1 = { id: 1, x:   0, y:   0, width: 100, height: 130 };
    var e3 = { id: 3, x: 250, y: 420, width: 100, height: 150 };
    var pair = new EntityPair(e1, e3); // diagonal but slightly better connected by vertical relationship
    expect(pair.overlapRange).toBe(null);
    expect(pair.overlapMidpoint).toBe(null);
  });

  it('can be refreshed after entity move', function() {
    // also testing handling of entities that are exactly the
    // same size AND centered on each other
    var e1 = { id: 1, x:   0, y:   0, width: 100, height: 100 };
    var e2 = { id: 2, x: 200, y:   0, width: 100, height: 100 };
    var pair = new EntityPair(e1, e2);
    expect(pair.orientation).toBe(0);
    expect(pair.overlapRange).toEqual([0, 100]);
    expect(pair.overlapMidpoint).toBe(50);

    //Move entity 2 from the right side to the bottom
    e2.x = 0;
    e2.y = 200;
    // before refreshing, nothing has changed (for performance)
    expect(pair.orientation).toBe(0);
    pair.refresh();
    // after refresh, things have updated
    expect(pair.orientation).toBe(1);
    expect(pair.overlapRange).toEqual([0, 100]);
    expect(pair.overlapMidpoint).toBe(50);

    // Nudge 2 pixels farther to the left
    e2.x = -2;
    e2.y = 200;
    pair.refresh();
    expect(pair.orientation).toBe(1);
    expect(pair.overlapRange).toEqual([0, 98]);
    expect(pair.overlapMidpoint).toBe(49);
  });

  // this is used to determine which relationship sets are
  // most offset from being directly horizontal/vertical
  // (most diagonal) and thus need to be connected nearest to
  // the corners of entities.
  it('calculates a placement priority for itself', function() {
    var eRef = { x:   0, y:    0, width: 100, height: 100 };
    var e0   = { x: 200, y: -110, width: 100, height: 100 }; //right side, skewed up heavily
    var e1   = { x: 200, y:  -10, width: 100, height: 100 }; //right side, offset up slightly
    var e2   = { x: 200, y:    0, width: 100, height: 100 }; //right side, centered
    var e3   = { x: 200, y:  150, width: 100, height: 100 }; //right side, skewed down heavily
    var e4   = { x: -60, y:  200, width: 100, height: 100 }; //bottom, offset left significantly
    var e5   = { x: 120, y:  200, width: 100, height: 100 }; //bottom, skewed right heavily
    var pair0 = new EntityPair(eRef, e0);
    var pair1 = new EntityPair(eRef, e1);
    var pair2 = new EntityPair(eRef, e2);
    var pair3 = new EntityPair(eRef, e3);
    var pair4 = new EntityPair(eRef, e4);
    var pair5 = new EntityPair(eRef, e5);
    expect(pair0.placementPriority).toBeCloseTo(159343.59);
    expect(pair1.placementPriority).toEqual(10);
    expect(pair2.placementPriority).toEqual(0);
    expect(pair3.placementPriority).toBeCloseTo(406162.00); // large because diagonal
    expect(pair4.placementPriority).toEqual(60);
    expect(pair5.placementPriority).toBeCloseTo(232105.36);
  });

  it('stores a set of relationships', function() {
    var pair = new EntityPair({}, {});
    pair.relationships.push({});
    expect(pair.relationships.length).toEqual(1);
  });

  it('centers a single relationship on the available space', function() {
    var e1 = { id: 1, x:   0, y:    0, width: 100, height: 100 };
    var e2 = { id: 2, x: 200, y:   20, width: 100, height:  60 };
    var r  = { entity1_id: 1, entity2_id: 2 }
    var pair = new EntityPair(e1, e2);
    pair.relationships.push({})
    pair.refresh();
    expect(pair.connectionPoints).toEqual([[{ x: 100, y: 50 }, { x: 200, y: 50 }]]);
  });
});
