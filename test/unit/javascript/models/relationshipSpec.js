'use strict';

describe('Relationship', function() {

  var r, entity1, entity2, endpoint1, endpoint2;

  beforeEach(function() {
    r = new window.Relationship(0);
    entity1 = new window.Entity({name: 'supplier'});
    entity2 = new window.Entity({name: 'part'});

    endpoint1 = new window.Endpoint({
      relationship: r,
      entity: entity1,
      otherEntity: entity2,
      label: 'supplies',
      symbol: 'none'
    });

    endpoint2 = new window.Endpoint({
      relationship: r,
      entity: entity2,
      otherEntity: entity1,
      label: 'supplied by',
      symbol: 'chickenfoot'
    });
  });

  it('remembers an ID number', function() {
    expect(r.id).toBe(0);
  });

  it('accepts endpoints', function() {
    expect(r.endpoints[0]).toBe(endpoint1);
    expect(r.endpoints[1]).toBe(endpoint2);
  });

  it('makes its endpoints aware of each other', function() {
    r.crosslink();
    expect(endpoint1.partner).toBe(endpoint2);
    expect(endpoint2.partner).toBe(endpoint1);
  });

});
