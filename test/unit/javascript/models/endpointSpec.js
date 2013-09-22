'use strict';

describe('Endpoint', function() {
  var r, endpoint, apple, tree;

  beforeEach(function() {
    r = new window.Relationship(0);

    tree  = new window.Entity({ name: 'tree' , x: 0, y:   0, width: 100, height: 100 });
    apple = new window.Entity({ name: 'apple', x: 0, y: 200, width: 100, height: 100 });

    endpoint = new window.Endpoint({
      relationship: r,
      entity: apple,
      otherEntity: tree,
      label: 'fruit of',
      symbol: 'chickenfoot'
    });
  });

  it('reports to a relationship', function() {
    expect(r.endpoints[0]).toBe(endpoint);
  });

  it('reports to an entity', function() {
    expect(apple.endpoints[0]).toBe(endpoint);
  });

  it('relocates itself on the most desirable side of its entity', function() {
    endpoint.relocate();
    expect(apple.sides['top'].endpoints[0]).toBe(endpoint);
  });
});
