'use strict';

describe('Relationship', function() {

  var r, entity1, entity2, endpoint1, endpoint2;

  beforeEach(function() {
    r = new window.Relationship(0);
    entity1 = new window.Entity({ x:  0, y:  0, width: 100, height: 100 });
    entity2 = new window.Entity({ x:200, y:150, width: 100, height: 100 });

    endpoint1 = new window.Endpoint({
      relationship: r,
      entity: entity1,
      otherEntity: entity2,
    });

    endpoint2 = new window.Endpoint({
      relationship: r,
      entity: entity2,
      otherEntity: entity1,
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
    expect(endpoint1.partner).toBe(endpoint2);
    expect(endpoint2.partner).toBe(endpoint1);
  });

  it('calculates a SVG path string', function() {
    endpoint1.relocate();
    endpoint2.relocate();
    endpoint1.side.negotiateEndpoints();
    endpoint2.side.negotiateEndpoints();
    expect(r.svgPath()).toBe('M100,90 L130,90 L170,160 L200,160')
  });

});
