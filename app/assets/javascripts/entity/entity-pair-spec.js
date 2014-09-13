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
});
