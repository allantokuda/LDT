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
      other_entity: entity2,
      label: 'supplies',
      symbol: 'none'
    });

    endpoint2 = new window.Endpoint({
      relationship: r,
      entity: entity2,
      other_entity: entity1,
      label: 'supplied by',
      symbol: 'chickenfoot'
    });
  });

  it('remembers an ID number', function() {
    expect(r.id).toBe(0);
  });

  it('accepts endpoints', function() {
    r.setEndpoint(endpoint1);
    r.setEndpoint(endpoint2);
    expect(r.endpoints[0]).toBe(endpoint1);
    expect(r.endpoints[1]).toBe(endpoint2);
  });


});
