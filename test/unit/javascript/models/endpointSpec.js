'use strict';

describe('Endpoint', function() {
  var r1, r2, endpoint1, endpoint2, partner1, partner2,
  apple, pear, tree;

  beforeEach(function() {
    r1 = new window.Relationship(0);
    r2 = new window.Relationship(0);

    tree  = new window.Entity({ name: 'tree' , x:   0, y:   0, width: 100, height: 200 }); // center at y=100
    apple = new window.Entity({ name: 'apple', x: 220, y:  40, width: 100, height: 100 }); // center at y=( 40+100/2)=90
    pear  = new window.Entity({ name: 'pear' , x: 220, y: 240, width: 100, height: 100 }); // center at y=(240+100/2)=290

    endpoint1 = new window.Endpoint({
      relationship: r1,
      entity: tree,
      otherEntity: apple,
      label: 'grows on',
      symbol: 'none'
    });

    endpoint2 = new window.Endpoint({
      relationship: r2,
      entity: tree,
      otherEntity: pear,
      label: 'grows on',
      symbol: ''
    });

    partner1 = new window.Endpoint({
      relationship: r1,
      entity: apple,
      otherEntity: tree,
      label: 'fruit of',
      symbol: 'chickenfoot'
    });

    partner2 = new window.Endpoint({
      relationship: r2,
      entity: pear,
      otherEntity: tree,
      label: 'fruit of',
      symbol: 'chickenfoot'
    });

  });

  it('stores a label', function() {
    expect(endpoint1.label).toBe('grows on');
  });

  it('stores a symbol', function() {
    expect(endpoint1.symbol).toBe('none');
  });

  it('reports to a relationship', function() {
    expect(r1.endpoints[0]).toBe(endpoint1);
  });

  it('reports to an entity', function() {
    expect(tree.endpoints[0]).toBe(endpoint1);
  });

  it('relocates itself on the most desirable side of its entity', function() {
    r1.crosslink();
    endpoint1.relocate();
    expect(endpoint1.side.name).toBe('right');
    expect(tree.sides['right'].endpoints[0]).toBe(endpoint1);
  });

  it('when a flat relationship line is possible, calculates ideal offset and angle', function() {
    r1.crosslink();
    endpoint1.relocate();
    partner1.relocate();
    endpoint1.calculateIdeals();

    // Center of subject entity (tree) is at -100.
    // Center of foreign entity (apple) is at -90.
    // Ideal offset from center of "tree" is more than -5,
    // because the tree entity is bigger (height 200).
    expect(endpoint1.idealOffset).toBe(-7);
    expect(endpoint1.idealAngle).toBe(0);
  });

  it('when a flat relationship line is NOT possible, calculates its ideal offset and angle', function() {
    r2.crosslink();
    endpoint2.relocate();
    partner2.relocate();
    endpoint2.calculateIdeals();

    // max offset = half of total height minus half of the arrow width
    // 0.5 * 200 - 0.5 * 20 = 90 pixels
    expect(endpoint2.idealOffset).toBe(90);

    //delta X: (120 - 2*30) = 60
    //delta Y: (250 - 190) = 60
    //angle: atan(60/40) = 45 degrees
    expect(Math.round(endpoint2.idealAngle)).toBe(35);
  });


});
