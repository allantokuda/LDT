'use strict';

describe('Entity Pair', function() {
  var pair1, pair2;

  beforeEach(module('LDT.entity'));
  beforeEach(inject(function(EntityPair) {
    var e1 = { id: 1, x:   0, y:   0, width: 100, height: 130 };
    var e2 = { id: 2, x: 250, y: 120, width: 100, height: 150 };
    var e3 = { id: 3, x: 250, y: 420, width: 100, height: 150 };

    pair1 = new EntityPair(e1, e2); // best connected by horizontal relationship
    pair2 = new EntityPair(e1, e3); // diagonal but slightly better connected by vertical relationship
  }));

  it('knows whether connecting relationships should be aligned vertically or horizontally', function() {
    expect(pair1.orientation()).toEqual(0); // 0: horizontal
    expect(pair2.orientation()).toEqual(1); // 1: vertical
  });
});
