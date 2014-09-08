'use strict';

describe('PairDictionary', function() {
  var p;

  beforeEach(module('lib'));
  beforeEach(inject(function(PairDictionary) {
    p = new PairDictionary;
  }));

  it('remembers values based on a pair of keys', function() {
    p.set(1,1,3);
    expect(p.get(1,1)).toEqual(3);
  });

  it('allows items to be overwritten', function() {
    p.set(1,1,3);
    p.set(1,1,4);
    expect(p.get(1,1)).toEqual(4);
  });

  it('stores a different value for each unique pair', function() {
    p.set(1,1,3);
    p.set(1,2,4);
    p.set(2,2,5);
    expect(p.get(1,1)).toEqual(3);
    expect(p.get(1,2)).toEqual(4);
    expect(p.get(2,2)).toEqual(5);
  });

  it('is undefined by default', function() {
    expect(p.get(9,9)).toBeUndefined();
  });

  it('allows items to be deleted', function() {
    p.set(1,1,3);
    expect(p.get(1,1)).toEqual(3);
    p.delete(1,1);
    expect(p.get(1,1)).toBeUndefined();
  });

  it('counts how many items it has', function() {
    p.set(1,1,3);
    expect(p.count()).toEqual(1);
  });


});
