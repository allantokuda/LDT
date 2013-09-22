'use strict';

describe('Side', function() {
  var side, endpoint;

  beforeEach(function() {
    endpoint = new window.Endpoint({
      entity:       new window.Entity({name: 'foo'}),
      otherEntity:  new window.Entity({name: 'bar'}),
      relationship: new window.Relationship(0),
      label: 'foo',
      symbol: 'chickenfoot'
    });

    side = new window.Side(endpoint.entity, 'top');
  });

  it('accepts endpoints', function() {
    side.addEndpoint(endpoint);
    expect(side.endpoints[0]).toBe(endpoint);
  });

  it('removes endpoints', function() {
    side.addEndpoint(endpoint);
    side.removeEndpoint(endpoint);
    expect(side.endpoints.length).toBe(0);
  });

  it('knows its outward vector', function() {
    expect(side.outwardVector).toEqual({x:0, y:-1});
  });
});
