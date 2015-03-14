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
      e1 = new Entity({ x:   0, y:   0, width: 100, height: 200 }); // center at y=100
      e2 = new Entity({ x: 220, y:  40, width: 100, height: 100 }); // center at y=( 40+100/2)=90
      e3 = new Entity({ x: 220, y: 240, width: 100, height: 100 }); // center at y=(240+100/2)=290

      r1 = new Relationship(0, e1, e2);

      // two relationships between same two entities
      r2 = new Relationship(1, e1, e3);
      r3 = new Relationship(2, e1, e3);

      spyOn(r1, 'place');
    });

    it('calculates best sides for attachment and applies them to relationships', function() {
      var p = new window.Path(e1, e2);
      p.addRelationship(r1);
      p.update();
      expect(r1.place).toHaveBeenCalledWith({ x: 100, y: 50, side: 'right'}, { x: 200, y: 50, side: 'left'})
    });
  });
});
