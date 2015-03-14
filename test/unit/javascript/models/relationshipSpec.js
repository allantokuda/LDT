'use strict';

describe('Relationship', function() {

  var r, entity1, entity2;

  beforeEach(function() {
    entity1 = new Entity({ x:  0, y:  0, width: 100, height: 100 });
    entity2 = new Entity({ x:200, y:150, width: 100, height: 100 });

    r = new Relationship(0, entity1, entity2);
  });

  it('remembers an ID number', function() {
    expect(r.id).toBe(0);
  });

  it('makes endpoints that have references to the supplied entities', function() {
    expect(r.endpoints[0].entity).toBe(entity1);
    expect(r.endpoints[1].entity).toBe(entity2);
  });

  it('makes endpoints that have references to each other', function() {
    expect(r.endpoints[0].partner).toBe(r.endpoints[1]);
    expect(r.endpoints[1].partner).toBe(r.endpoints[0]);
  });

  it('calculates a SVG path string', function() {
    r.endpoints[0].relocate();
    r.endpoints[1].relocate();
    r.endpoints[0].negotiateCoordinates();
    r.endpoints[1].negotiateCoordinates();
    expect(r.svgPath()).toBe('M100,90 L130,90 L170,160 L200,160');
  });

  it('can be placed (by assigning its endpoint coordinates and orientations)', function() {
    r.place({ x: 7, y: 8, side: 'left' }, { x: 106, y: 55, side: 'right' });
    expect(r.endpoints[0].x).toEqual(7);
    expect(r.endpoints[0].y).toEqual(8);
    expect(r.endpoints[0].sideName).toEqual('left');
    expect(r.endpoints[1].x).toEqual(106);
    expect(r.endpoints[1].y).toEqual(55);
    expect(r.endpoints[1].sideName).toEqual('right');
  });
});
