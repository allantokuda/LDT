'use strict';

describe('Distributor', function() {
  describe('overlapRange()', function() {
    it('calculates the overlapping range when the ranges are staggered', function() {
      var range1 = window.Distributor.overlapRange({ min: 0, max: 100 }, { min:  50, max: 150 });
      var range2 = window.Distributor.overlapRange({ min: 0, max: 100 }, { min: -50, max:  50 });
      expect(range1).toEqual({ min: 50, max: 100 });
      expect(range2).toEqual({ min:  0, max:  50 });
    });

    it('calculates the overlapping range when the ranges are nested', function() {
      var range1 = window.Distributor.overlapRange({ min: 0, max: 100 }, { min:  50, max:  90 });
      var range2 = window.Distributor.overlapRange({ min: 0, max:  30 }, { min: -50, max:  90 });
      expect(range1).toEqual({ min: 50, max: 90 });
      expect(range2).toEqual({ min:  0, max: 30 });
    });

    it('returns null when there is no overlap', function() {
      var range1 = window.Distributor.overlapRange({ min: 0, max: 100 }, { min: 150, max: 200 });
      var range2 = window.Distributor.overlapRange({ min: 0, max:  30 }, { min:  50, max:  90 });
      expect(range1).toBe(null);
      expect(range2).toBe(null);
    });
  });

  it('centers one item on the overlapping range', function() {
    var loc1 = window.Distributor.distribute(1, { min: 0, max: 100 }, { min: 50, max: 150 });
    var loc2 = window.Distributor.distribute(1, { min: 0, max: 100 }, { min: 20, max:  50 });

    expect(loc1).toEqual([[75], [75]])
    expect(loc2).toEqual([[35], [35]])
  });

  it('minimizes the harshness of diagonal paths, down to arrowhead width', function() {
    var loc1 = window.Distributor.distribute(1, { min:   0, max: 100 }, { min: 150, max: 250 });
    var loc2 = window.Distributor.distribute(1, { min: 150, max: 250 }, { min:   0, max: 100 });

    expect(loc1).toEqual([[90], [160]]);
    expect(loc2).toEqual([[160], [90]]);
  });

  it('distributes items within available overlap', function() {
    var loc = window.Distributor.distribute(3, { min: 0, max: 70 }, { min: 0, max: 70 });
    expect(loc).toEqual([[10, 35, 60], [10, 35, 60]]);
  });

  it('has a max amount it distributes items when space is plentiful', function() {
    var loc = window.Distributor.distribute(2, { min: 0, max: 200 }, { min: 0, max: 200 });
    expect(loc).toEqual([[70, 130], [70, 130]]);
  });

  it('does the best it can when there is insufficient space to attach', function() {
    var loc = window.Distributor.distribute(3, { min: 0, max: 30 }, { min: 30, max: 60 });
    expect(loc).toEqual([[10, 15, 20], [40, 45, 50]]);
  });

  it('keeps items spaced on the wide side even while the opposite side is crammed', function() {
    var loc = window.Distributor.distribute(2, { min: 20, max: 50 }, { min: 0, max: 100 });
    expect(loc).toEqual([[30, 40], [25, 45]]);
  });
});
