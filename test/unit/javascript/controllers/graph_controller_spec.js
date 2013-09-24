'use strict';

describe('GraphCtrl', function(){
  var ctrl, scope, paths;
  beforeEach(module('myApp.controllers'));
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('GraphCtrl', {$scope: scope});

    scope.graph.relationships = [
      {id: 0, entity1_id: 0, entity2_id: 1, symbol1: 'none', symbol2: 'chickenfoot'}
    ];
    scope.graph.entities = [
      {id: 0, x: 0, y: 0, width: 100, height: 120, name: 'thing',  attributes: 'size\nshape'},
      {id: 1, x: 0, y: 0, width: 100, height: 120, name: 'gadget', attributes: 'shape'},
      {id: 2, x: 0, y: 0, width: 100, height: 120, name: 'doodad', attributes: ''}
    ];
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

});
