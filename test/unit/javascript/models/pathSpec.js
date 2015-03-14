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
      var r1 = new window.Relationship({ entity_id1: 1, entity_id2: 2 });
      p.addRelationship(r1);
      p.removeRelationship(r1);
      expect(p.relationships.length).toEqual(0);
    });
  });

  describe('path calculation', function() {
    var e1, e2, e3, r1, r2, r3;

    beforeEach(function() {
      e1 = new Entity({ x:   0, y:   0, width: 100, height: 100 });
      e2 = new Entity({ x: 200, y:  50, width: 100, height: 100 });
      e3 = new Entity({ x:  50, y: 200, width: 100, height: 100 });

      r1 = { place: function(){} };
      r2 = { place: function(){} };

      spyOn(r1, 'place');
      spyOn(r2, 'place');
    });

    it('calculates best sides for attachment and applies them to relationships', function() {
      var p1 = new window.Path(e1, e2); // roughly horizontal
      var p2 = new window.Path(e1, e3); // diagoal but slightly more "vertical" than "horizontal"
      p1.addRelationship(r1);
      p2.addRelationship(r2);
      p1.update();
      p2.update();
      expect(r1.place).toHaveBeenCalledWith({ x: 100, y:  75, side: 'right' }, { x: 200, y:  75, side: 'left'})
      expect(r2.place).toHaveBeenCalledWith({ x:  75, y: 100, side: 'bottom'}, { x:  75, y: 200, side: 'top' })
    });
  });
});
