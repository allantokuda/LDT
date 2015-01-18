'use strict';

describe('GraphStore', function() {
  var GraphStore;

  beforeEach(module('LDT.controllers'));
  beforeEach(inject(function(_GraphStore_) {
    GraphStore = _GraphStore_;
  }));

  // This may not be a requirement later
  it('instantiates an empty graph object', function() {
    expect(GraphStore.graph.id).toEqual(0);
    expect(GraphStore.graph.name).toEqual('');
    expect(GraphStore.graph.entities).toEqual([]);
    expect(GraphStore.graph.relationships).toEqual([]);
    expect(GraphStore.graph.pan).toEqual({x: 0, y: 0});
  });

  describe('load()', function() {
    it('returns a promise for a graph object', function() {
      var promise = GraphStore.load();
      expect(typeof(promise.then)).toEqual('function');
    });
  });
});
