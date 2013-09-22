'use strict';

describe('Side', function() {
  var topSide, bottomSide, leftSide, rightSide, endpoint;

  beforeEach(function() {
    endpoint = new window.Endpoint({
      entity:       new window.Entity({name: 'foo', x:0, y:0, width: 100, height: 80}),
      otherEntity:  new window.Entity({name: 'bar'}),
      relationship: new window.Relationship(0),
      label: 'foo',
      symbol: 'chickenfoot'
    });

    topSide    = new window.Side(endpoint.entity, 'top');
    bottomSide = new window.Side(endpoint.entity, 'bottom');
    leftSide   = new window.Side(endpoint.entity, 'left');
    rightSide  = new window.Side(endpoint.entity, 'right');
  });

  it('accepts endpoints', function() {
    topSide.addEndpoint(endpoint);
    expect(topSide.endpoints[0]).toBe(endpoint);
  });

  it('removes endpoints', function() {
    topSide.addEndpoint(endpoint);
    topSide.removeEndpoint(endpoint);
    expect(topSide.endpoints.length).toBe(0);
  });

  it('knows its outward vector', function() {
    expect(  topSide.outwardVector).toEqual({x:0, y:-1});
    expect(rightSide.outwardVector).toEqual({x:1, y: 0});
  });

  it('knows its orientation', function() {
    expect(  topSide.orientation).toBe('horizontal');
    expect(rightSide.orientation).toBe('vertical');
  });

  it('determines its span (length)', function() {
    expect(   topSide.span()).toEqual(100);
    expect(bottomSide.span()).toEqual(100);
    expect(  leftSide.span()).toEqual(80);
    expect( rightSide.span()).toEqual(80);
  });

  it('chooses the lateral component of a given coordinate pair', function() {
    expect(   topSide.along({ x:10, y:50 })).toBe(10);
    expect(bottomSide.along({ x:10, y:50 })).toBe(10);
    expect(  leftSide.along({ x:10, y:50 })).toBe(50);
    expect( rightSide.along({ x:10, y:50 })).toBe(50);
  });

  it('calculates coordinates of a point along it, offset from its center', function() {
    expect(   topSide.centerOffsetCoordinates(7)).toEqual({ x:  57, y:  0 });
    expect(bottomSide.centerOffsetCoordinates(7)).toEqual({ x:  57, y: 80 });
    expect(  leftSide.centerOffsetCoordinates(7)).toEqual({ x:   0, y: 47 });
    expect( rightSide.centerOffsetCoordinates(7)).toEqual({ x: 100, y: 47 });
  });
});
