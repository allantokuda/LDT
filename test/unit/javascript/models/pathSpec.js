'use strict';

describe('Path Model', function() {
  describe('relationship ownership', function() {
    it('stores relationship objects', function() {
      var p = new window.Path();
      var r = {};
      p.addRelationship(r);
      expect(p.relationships.length).toEqual(1);
      expect(p.relationships[0]).toBe(r);
    });

    it('de-duplicates', function() {
      var p = new window.Path();
      var r1 = {};
      var r2 = {};
      p.addRelationship(r1);
      p.addRelationship(r1);
      p.addRelationship(r2);
      expect(p.relationships.length).toEqual(2);
      expect(p.relationships[0]).toBe(r1);
      expect(p.relationships[1]).toBe(r2);
    });

    it('allows relationships to be deleted', function() {
      var p = new window.Path();
      var r1 = new window.Relationship(0, { id: 1 }, { id: 2 });
      p.addRelationship(r1);
      p.removeRelationship(r1);
      expect(p.relationships.length).toEqual(0);
    });
  });

  describe('response to entity change', function() {
    it("subscribes to its entities' change events", function() {
      var callback1, callback2;
      var e1 = { addChangeCallback: function(fn) { callback1 = fn; } }
      var e2 = { addChangeCallback: function(fn) { callback2 = fn; } }
      var p = new window.Path(e1, e2);
      expect(callback1).toBe(p.update);
      expect(callback2).toBe(p.update);
    });
  });

  describe('endpoint placement', function() {
    var r1, r2, r3;

    beforeEach(function() {
      r1 = { id: 'r1', place: function(){} };
      r2 = { id: 'r2', place: function(){} };
      r3 = { id: 'r3', place: function(){} };

      spyOn(r1, 'place');
      spyOn(r2, 'place');
      spyOn(r3, 'place');
    });

    it('calculates best sides for attachment and applies them to relationships', function() {
      var e1 = new Entity({ x:   0, y:   0, width: 100, height: 100 });
      var e2 = new Entity({ x: 200, y:  50, width: 100, height: 100 });
      var e3 = new Entity({ x:  50, y: 200, width: 100, height: 100 });

      //  ___
      // |1  |    ___
      // |___|---|2  |
      //    |    |___|
      //    ___
      //   |3  |
      //   |___|

      var p1 = new window.Path(e1, e2); // roughly horizontal
      var p2 = new window.Path(e1, e3); // roughly vertical

      p1.addRelationship(r1);
      p2.addRelationship(r2);

      p1.update();
      p2.update();

      var r1_endpoint1 = r1.place.calls[0].args[0];
      var r1_endpoint2 = r1.place.calls[0].args[1];
      var r2_endpoint1 = r2.place.calls[0].args[0];
      var r2_endpoint2 = r2.place.calls[0].args[1];

      expect(r1_endpoint1).toEqual({side: 'right', x: 100, y: 75});
      expect(r1_endpoint2).toEqual({side: 'left', x: 200, y: 75});

      expect(r2_endpoint1).toEqual({side: 'bottom', x: 75, y: 100});
      expect(r2_endpoint2).toEqual({side: 'top', x: 75, y: 200});
    });

    it('keeps endpoints connecting within entity bounds when entities are diagonal', function() {
      var e1 = new Entity({ x:   0, y:   0, width: 100, height: 100 });
      var e2 = new Entity({ x: 200, y: 190, width: 100, height: 100 });
      var e3 = new Entity({ x: 190, y: 200, width: 100, height: 100 });

      //  ___
      // |1  |
      // |___|
      //      \
      //       \____
      //       |2,3||
      //       |___||

      var p1 = new window.Path(e1, e2); // diagonal but slightly more "horizontal" than "vertical"
      var p2 = new window.Path(e1, e3); // diagonal but slightly more "vertical" than "horizontal"

      p1.addRelationship(r1);
      p2.addRelationship(r2);

      p1.update();
      p2.update();

      expect(r1.place).toHaveBeenCalledWith({ x: 100, y:  90, side: 'right' }, { x: 200, y: 200, side: 'left'})
      expect(r2.place).toHaveBeenCalledWith({ x:  90, y: 100, side: 'bottom'}, { x: 200, y: 200, side: 'top' })
    });
  });
});
