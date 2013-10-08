'use strict';

describe('Entity', function() {
  var e = new Entity({
    name: 'Test',
    attributes: 'abc\ndef',
    x: 100,
    y: 100,
    width: 120,
    height: 140
  });
  var entityOnRight  = new Entity({ x:  300, y:  100, width: 100, height: 100 });
  var entityOnLeft   = new Entity({ x: -300, y:  100, width: 100, height: 100 });
  var entityOnTop    = new Entity({ x:  100, y: -300, width: 100, height: 100 });
  var entityOnBottom = new Entity({ x:  100, y:  300, width: 100, height: 100 });

  it('has the same attributes as its input hash', function() {
    expect(e.name).toBe('Test')
    expect(e.x).toBe(100)
    expect(e.y).toBe(100)
    expect(e.width).toBe(120)
    expect(e.height).toBe(140)
    expect(e.attributes).toBe('abc\ndef')
  });

  it('knows its center point coordinates', function() {
    expect(e.center()).toEqual({x: 160, y: 170});
  });

  it('knows when another entity is on its right', function() {
    expect(e.nearestSide(entityOnRight)).toBe('right')
  });

  it('knows when another entity is on its left', function() {
    expect(e.nearestSide(entityOnLeft)).toBe('left')
  });

  it('knows when another entity is above it', function() {
    expect(e.nearestSide(entityOnTop)).toBe('top')
  });

  it('knows when another entity is below it', function() {
    expect(e.nearestSide(entityOnBottom)).toBe('bottom')
  });

  it('calculates coordinates of a point along one of its sides, offset from the side\'s center', function() {
    expect(e.sideCenterOffsetCoordinates('top',    7)).toEqual({ x: 167, y: 100 });
    expect(e.sideCenterOffsetCoordinates('bottom', 7)).toEqual({ x: 167, y: 240 });
    expect(e.sideCenterOffsetCoordinates('left',   7)).toEqual({ x: 100, y: 177 });
    expect(e.sideCenterOffsetCoordinates('right',  7)).toEqual({ x: 220, y: 177 });
  });

  it('provides the span (length) of its sides', function() {
    expect(e.span('top'   )).toBe(120);
    expect(e.span('bottom')).toBe(120);
    expect(e.span('left'  )).toBe(140);
    expect(e.span('right' )).toBe(140);
  });
});
