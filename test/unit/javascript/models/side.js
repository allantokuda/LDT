'use strict';

describe('Side', function() {
  var topSide, rightSide, endpoint;

  beforeEach(function() {
    endpoint = new window.Endpoint({
      entity:       new window.Entity({name: 'foo', width: 100, height: 80}),
      otherEntity:  new window.Entity({name: 'bar'}),
      relationship: new window.Relationship(0),
      label: 'foo',
      symbol: 'chickenfoot'
    });

    topSide   = new window.Side(endpoint.entity, 'top');
    rightSide = new window.Side(endpoint.entity, 'right');
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
    expect(  topSide.span()).toEqual(100);
    expect(rightSide.span()).toEqual(80);
  });
});
