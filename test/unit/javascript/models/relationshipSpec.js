'use strict';

describe('Relationship', function() {

  var r, entity1, entity2;

  beforeEach(function() {
    entity1 = new Entity({ id: 7, x:  0, y:  0, width: 100, height: 100 });
    entity2 = new Entity({ id: 8, x:200, y:150, width: 100, height: 100 });

    r = new Relationship(0, entity1, entity2);
  });

  it('remembers an ID number', function() {
    expect(r.id).toBe(0);
  });

  it('calculates a SVG path string', function() {
    r.place({ x: 100, y: 90, side: 'right' }, { x: 200, y: 160, side: 'left' });
    expect(r.svgPath()).toBe('M100,90 L130,90 L170,160 L200,160');
  });

  it('can be placed (by assigning its endpoint coordinates and orientations)', function() {

    var e1 = new Entity({ id: 1 });
    var e2 = new Entity({ id: 2 });

    var r1 = new Relationship(0, e1, e2);

    r1.place({ x: 7, y: 8, side: 'left' }, { x: 106, y: 55, side: 'right' });
    expect(r1.endpoints[0].x).toEqual(7);
    expect(r1.endpoints[0].y).toEqual(8);
    expect(r1.endpoints[0].sideName).toEqual('left');
    expect(r1.endpoints[0].outwardVector).toEqual({ x:-1, y: 0 });
    expect(r1.endpoints[1].x).toEqual(106);
    expect(r1.endpoints[1].y).toEqual(55);
    expect(r1.endpoints[1].sideName).toEqual('right');
    expect(r1.endpoints[1].outwardVector).toEqual({ x: 1, y: 0 });
  });

  it('when placing, obscures that its entities may not be stored in standard order (smaller entity ID first is standard, larger first is reverse)', function() {

    var e1 = new Entity({ id: 2 });
    var e2 = new Entity({ id: 1 });

    var r1 = new Relationship(0, e1, e2);

    // place() method takes smaller entity ID first, then larger
    r1.place({ x: 17, y: 18, side: 'top' }, { x: 116, y: 65, side: 'bottom' });

    // these are placed in opposite order
    expect(r1.endpoints[0].x).toEqual(116);
    expect(r1.endpoints[0].y).toEqual(65);
    expect(r1.endpoints[0].sideName).toEqual('bottom');
    expect(r1.endpoints[0].outwardVector).toEqual({ x: 0, y: 1 });
    expect(r1.endpoints[1].x).toEqual(17);
    expect(r1.endpoints[1].y).toEqual(18);
    expect(r1.endpoints[1].sideName).toEqual('top');
    expect(r1.endpoints[1].outwardVector).toEqual({ x: 0, y:-1 });
  });
});
