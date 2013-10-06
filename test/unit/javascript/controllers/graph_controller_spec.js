'use strict';

describe('GraphCtrl', function(){
  var ctrl, scope, childScope, paths, r, e1, e2, e3, ep1, ep2;
  beforeEach(module('myApp.controllers'));
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('GraphCtrl', {$scope: scope});
    childScope = scope.$new();

    e1 = new Entity({id: 0, x: 0, y: 0, width: 100, height: 120, name: 'thing',  attributes: 'size\nshape'});
    e2 = new Entity({id: 1, x: 0, y: 0, width: 100, height: 120, name: 'gadget', attributes: 'shape'});
    e3 = new Entity({id: 2, x: 0, y: 0, width: 100, height: 120, name: 'doodad', attributes: ''});

    r = new Relationship(0);

    ep1 = new Endpoint({ entity: e1, otherEntity: e2, relationship: r });
    ep2 = new Endpoint({ entity: e2, otherEntity: e1, relationship: r });

    e1.endpoints = [ep1];
    e2.endpoints = [ep2];

    scope.graph.relationships = [r];
    scope.graph.entities = [e1, e2, e3];
    scope.graph.endpoints = [ep1, ep2];
  }));

  describe('next entity ID number', function() {
    it('should be largest entity ID + 1', function() {
      scope.graph.initialize();
      expect(scope.graph.next_entity_id).toEqual(3);
    });

    it('should be 1 when there are no entities', function() {
      scope.graph.entities = [];
      scope.graph.initialize();
      expect(scope.graph.next_entity_id).toEqual(0);
    });

    it('should be 1 when the entity set has not been defined', function() {
      scope.graph.entities = undefined;
      scope.graph.initialize();
      expect(scope.graph.next_entity_id).toEqual(0);
    });
  });

  describe('next relationship ID number', function() {
    it('should be largest relationship ID + 1', function() {
      scope.graph.initialize();
      expect(scope.graph.next_relationship_id).toEqual(1);
    });

    it('should be 1 when there are no relationships', function() {
      scope.graph.relationships = [];
      scope.graph.initialize();
      expect(scope.graph.next_relationship_id).toEqual(0);
    });

    it('should be 1 when the relationship set has not been defined', function() {
      scope.graph.relationships = undefined;
      scope.graph.initialize();
      expect(scope.graph.next_relationship_id).toEqual(0);
    });
  });

  it('should set all entities deselected when deselect() is called', function() {
    scope.deselectAll();
    _.map(scope.graph.entities, function(entity) {
      expect(entity.selected).toBe(false);
        'M100,65 L130,65 L170,65 L200,65'
    });
  });

  describe('deletion of entity', function() {
    beforeEach(inject(function() {
      scope.graph.deleteEntity(e2);
    }));

    it('should delete the entity from the graph', function() {
      expect(scope.graph.entities.length).toBe(2);
    });

    it('should delete all connected relationships', function() {
      expect(scope.graph.relationships.length).toBe(0);
    });
  });

  describe('deletion of relationship', function() {
    beforeEach(inject(function() {
      scope.graph.deleteRelationship(r);
    }));

    it('should delete the relationship from the graph', function() {
      expect(scope.graph.relationships.length).toBe(0);
    });

    it('should delete the associated endpoints from the graph', function() {
      expect(scope.graph.endpoints.length).toBe(0);
    });
  });

  describe('event handling', function() {
    it('should catch and rebroadcast entityGeometryChange events', function() {
      spyOn(scope, '$broadcast');
      childScope.$emit('entityGeometryChange', 42);
      expect(scope.$broadcast).toHaveBeenCalledWith('relocateIfAttachedToEntity', 42);
    });
  });

  describe('#createRelationship', function() {
    var r2;

    beforeEach(inject(function() {
      scope.graph.arrowheads = [];
      r2 = scope.graph.createRelationship(e1, e2);
    }));

    it('should create a relationship', function() {
      expect(r2).toBeDefined();
    });

    it('should add the relationship to the graph scope', function() {
      expect(_.last(scope.graph.relationships)).toBe(r2);
    });

    it('should add the endpoints to the graph scope', function() {
      expect(_.last(scope.graph.endpoints)).toBe(r2.endpoints[1]);
    });

    it('should add arrowheads to the graph scope', function() {
      expect(_.last(scope.graph.arrowheads)).toBe(r2.endpoints[1].arrowhead);
    });
  });

});
