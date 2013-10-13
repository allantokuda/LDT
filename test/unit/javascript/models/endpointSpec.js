'use strict';

describe('Endpoint', function() {
  var r1, r2, apple, pear, tree;

  beforeEach(function() {
    tree  = new Entity({ name: 'tree' , x:   0, y:   0, width: 100, height: 200 }); // center at y=100
    apple = new Entity({ name: 'apple', x: 220, y:  40, width: 100, height: 100 }); // center at y=( 40+100/2)=90
    pear  = new Entity({ name: 'pear' , x: 220, y: 240, width: 100, height: 100 }); // center at y=(240+100/2)=290

    r1 = new Relationship(0, tree, apple);
    r2 = new Relationship(0, tree, pear);

    r1.endpoints[0].label = 'grows on'
    r2.endpoints[0].label = 'grows on'
    r1.endpoints[1].label = 'fruit of'
    r2.endpoints[1].label = 'fruit of'
    r1.endpoints[0].symbol = 'none'
    r2.endpoints[0].symbol = 'none'
    r1.endpoints[1].symbol = 'chickenfoot'
    r2.endpoints[1].symbol = 'chickenfoot'
  });

  it('relocates itself on the most desirable side of its entity', function() {
    r1.endpoints[0].relocate();
    expect(r1.endpoints[0].sideName).toBe('right');
    expect(tree.endpoints['right'][0]).toBe(r1.endpoints[0]);
  });

  it('knows its outward vector', function() {
    r1.endpoints[0].relocate();
    r1.endpoints[1].relocate();
    expect(r1.endpoints[0].outwardVector).toEqual({x:1, y: 0});
    expect(r1.endpoints[1].outwardVector).toEqual({x:-1, y: 0});
  });


  it('when a flat relationship line is possible, calculates ideal offset and angle', function() {
    r1.endpoints[0].relocate();
    r1.endpoints[1].relocate();
    r1.endpoints[0].calculateIdeals();

    // Center of subject entity (tree) is at -100.
    // Center of foreign entity (apple) is at -90.
    // Ideal offset from center of "tree" is more than -5,
    // because the tree entity is bigger (height 200).
    expect(r1.endpoints[0].idealOffset).toBe(-7);
    expect(r1.endpoints[0].idealAngle).toBe(0);
  });

  it('when a flat relationship line is NOT possible, calculates its ideal offset and angle', function() {
    r2.endpoints[0].relocate();
    r2.endpoints[1].relocate();
    r2.endpoints[0].calculateIdeals();

    // max offset = half of total height minus half of the arrow width
    // 0.5 * 200 - 0.5 * 20 = 90 pixels
    expect(r2.endpoints[0].idealOffset).toBe(90);

    //delta X: (120 - 2*30) = 60
    //delta Y: (250 - 190) = 60
    //angle: atan(60/40) = 45 degrees
    expect(Math.round(r2.endpoints[0].idealAngle)).toBe(35);
  });

  it('provides an arrowhead SVG path', function() {
    r1.endpoints[0].relocate();
    r1.endpoints[1].relocate();
    r1.endpoints[1].calculateIdeals();
    r1.endpoints[1].negotiateCoordinates();
    expect(r1.endpoints[1].arrowheadPath()).toEqual('M220,93m0,10 l-20,-10 l20,-10');
  });

  it('determines its siblings from its parent entity', function() {
    r1.endpoints[0].relocate();
    r1.endpoints[1].relocate();
    r2.endpoints[0].relocate();
    r2.endpoints[1].relocate();
    expect(r1.endpoints[0].siblings().length).toBe(2);
    expect(r2.endpoints[0].siblings().length).toBe(2);
  })

  it('knows how many of its siblings (endpoints sharing an entity side) are FULL siblings (endpoints also sharing an "otherEntity" side)', function() {
  });

});
