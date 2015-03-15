'use strict';

describe('Endpoint', function() {
  it('provides an arrowhead SVG path', function() {
    var e = new window.Endpoint({ entity: {}, otherEntity: {}, label: 'example', symbol: '?' });
    e.x = 220.1;
    e.y = 93.1;
    e.sideName = 'left';
    e.setOutwardVector();

    // mock out SVG path (doesn't matter for this unit test)
    window.arrowheadSVG['?']['left'] = 'm0,10 l-20,-10 l20,-10';

    expect(e.arrowheadPath()).toEqual('M220,93m0,10 l-20,-10 l20,-10');
  });
});
