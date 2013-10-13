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

  it('provides the coordinate range (x or y) along a side (top/bottom/left/right)', function() {
    expect(e.coordinateRange('top'   )).toEqual({ min: 100, max: 220 });
    expect(e.coordinateRange('bottom')).toEqual({ min: 100, max: 220 });
    expect(e.coordinateRange('left'  )).toEqual({ min: 100, max: 240 });
    expect(e.coordinateRange('right' )).toEqual({ min: 100, max: 240 });
  });

  it('finds an endpoint object attached on any of its sides, and removes it', function() {
    var endpoint = { };
    e.endpoints['left'].push(endpoint);
    e.removeEndpoint(endpoint);
    expect(e.endpoints['left']).toEqual([]);
  });

  it('adds an endpoint object to its sides, removing it from others at the same time', function() {
    var endpoint = { };
    e.addEndpoint(endpoint, 'bottom');
    e.addEndpoint(endpoint, 'left');
    expect(e.endpoints['left']).toEqual([endpoint]);
    expect(e.endpoints['bottom']).toEqual([]);
  });

  it('removes all endpoints from all sides', function() {
    var ep1 = { };
    var ep2 = { };
    e.endpoints['left'].push(ep1);
    e.endpoints['bottom'].push(ep2);
    e.clearAllEndpoints();
    expect(e.endpoints['left']).toEqual([]);
    expect(e.endpoints['bottom']).toEqual([]);
  });

  it('provides a flat array of all of its endpoints', function() {
    var ep1 = { };
    var ep2 = { };
    e.endpoints['left'].push(ep1);
    e.endpoints['bottom'].push(ep2);
    var result = e.clearAllEndpoints();
    expect(result.length).toBe(2);
  });
});
