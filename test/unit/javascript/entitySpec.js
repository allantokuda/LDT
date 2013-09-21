'use strict';

describe('Entity', function() {
  var e = new window.Entity({
      name: 'Test',
      attributes: 'abc\ndef',
      x: 100,
      y: 100,
      width: 120,
      height: 120
  });
  var entityOnRight  = new window.Entity({ x:  300, y:  100, width: 100, height: 100 });
  var entityOnLeft   = new window.Entity({ x: -300, y:  100, width: 100, height: 100 });
  var entityOnTop    = new window.Entity({ x:  100, y: -300, width: 100, height: 100 });
  var entityOnBottom = new window.Entity({ x:  100, y:  300, width: 100, height: 100 });

  it('has the same attributes as its input hash', function() {
    expect(e.name).toEqual('Test')
    expect(e.x).toEqual(100)
  });

  it('knows its center point coordinates', function() {
    expect(e.center()).toEqual({x: 160, y: 160});
  });

  it('has four side objects', function() {
    expect(e.sides['top'].name).toEqual('top')
    expect(e.sides['left'].name).toEqual('left')
    expect(e.sides['right'].name).toEqual('right')
    expect(e.sides['bottom'].name).toEqual('bottom')

    expect(e.sides['top'].endpoints).toEqual([])
    expect(e.sides['left'].endpoints).toEqual([])
    expect(e.sides['right'].endpoints).toEqual([])
    expect(e.sides['bottom'].endpoints).toEqual([])
  });

  it('knows when another entity is on its right', function() {
    expect(e.nearestSide(entityOnRight)).toBe(e.sides['right'])
  });

  it('knows when another entity is on its left', function() {
    expect(e.nearestSide(entityOnLeft)).toBe(e.sides['left'])
  });

  it('knows when another entity is above it', function() {
    expect(e.nearestSide(entityOnTop)).toBe(e.sides['top'])
  });

  it('knows when another entity is below it', function() {
    expect(e.nearestSide(entityOnBottom)).toBe(e.sides['bottom'])
  });

  // This now needs to be in the endpoint test
  xit('assigns an endpoint to a side', function() {
    var endpointOnRight  = { other_entity: entityOnRight }
    var endpointOnBottom = { other_entity: entityOnBottom }
    e.attachEndpoint(endpointOnRight);
    e.attachEndpoint(endpointOnBottom);
    e.assignEndpointsToSides();
    expect(e.sides['right'].endpoints.length).toBe(1);
    expect(e.sides['right'].endpoints[0]).toBe(endpointOnRight);
    expect(e.sides['bottom'].endpoints.length).toBe(1);
    expect(e.sides['bottom'].endpoints[0]).toBe(endpointOnBottom);
    expect(e.sides['top'].endpoints.length).toBe(0);
    expect(e.sides['left'].endpoints.length).toBe(0);
  });

});
