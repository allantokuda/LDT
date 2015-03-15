'use strict';

describe('Entity', function() {
  var e = new Entity({
    name: 'Test',
    attributes: 'abc\ndef',
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
    expect(e.attributes).toBe('abc\ndef');
  });

  it('accepts change callback functions', function() {
    var called = false;
    var callback = function() { called = true; };
    e.addChangeCallback(callback);
    e.notifyChange();
    expect(called).toBe(true);
  });
});
