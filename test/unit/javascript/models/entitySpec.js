'use strict';

describe('Entity', function() {
  var e = new Entity({
    name: 'Test',
    attributes: 'abc*\ndef',
    x: 100,
    y: 100,
    width: 120,
    height: 140
  });

  it('has the same attributes as its input hash', function() {
    expect(e.name).toBe('Test');
    expect(e.x).toBe(100);
    expect(e.y).toBe(100);
    expect(e.width).toBe(120);
    expect(e.height).toBe(140);
    expect(e.attributes).toBe('abc*\ndef');
  });

  it('accepts change callback functions', function() {
    var called = false;
    var callback = function() { called = true; };
    e.addChangeCallback(callback);
    e.notifyChange();
    expect(called).toBe(true);
  });

  it('remembers attached relationships', function() {
    var r1 = {};
    var r2 = {};
    expect(e.getRelationships().length).toBe(0);
    e.attachRelationship(r1);
    expect(e.getRelationships().length).toBe(1);
    e.attachRelationship(r1);
    expect(e.getRelationships().length).toBe(1);
    e.attachRelationship(r2);
    expect(e.getRelationships().length).toBe(2);
    e.removeRelationship(r1);
    expect(e.getRelationships().length).toBe(1);
    e.removeRelationship(r1);
    expect(e.getRelationships().length).toBe(1);
    e.removeRelationship(r2);
    expect(e.getRelationships().length).toBe(0);
  });
});
