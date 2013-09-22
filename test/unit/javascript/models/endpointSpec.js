'use strict';

describe('Endpoint', function() {
  var r, endpoint, apple, tree;

  beforeEach(function() {
    r = new window.Relationship(0);

    apple = new window.Entity({ name: 'apple' });
    tree  = new window.Entity({ name: 'tree' });

    endpoint = new window.Endpoint({
      relationship: r,
      entity: apple,
      other_entity: tree,
      label: 'fruit of',
      symbol: 'chickenfoot'
    });
  });

  it('reports to a relationship', function() {
    expect(r.endpoints[0]).toBe(endpoint);
  });
});
