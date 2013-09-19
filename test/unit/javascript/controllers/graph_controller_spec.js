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

  describe('relationship SVG paths', function() {
    beforeEach(inject(function() {
      paths = function() {
        return _.map(scope.graph.decoratedRelationships, function(r) { return r.svgPath(); } );
      }
    }));

    it('should calculate a straight horizontal path', function() {
      scope.graph.entities[1].x = 200;
      scope.graph.entities[1].y =  10;
      scope.$digest();
      expect(paths()).toEqual([
        'M100,65 L130,65 L170,65 L200,65'
      ]);
    });

    it('should calculate a straight horizontal path when marginally possible', function() {
      scope.graph.entities[1].x = 200;
      scope.graph.entities[1].y = 100;
      scope.$digest();
      expect(paths()).toEqual([
        'M100,110 L130,110 L170,110 L200,110'
      ]);
    });

    it('should calculate a straight vertical path', function() {
      scope.graph.entities[1].x =  10;
      scope.graph.entities[1].y = 200;
      scope.$digest();
      expect(paths()).toEqual([
        'M55,120 L55,150 L55,170 L55,200'
      ]);
    });

    it('should calculate an angled path', function() {
      scope.graph.entities[1].x = 200;
      scope.graph.entities[1].y = 300;
      scope.$digest();
      expect(paths()).toEqual([
        'M90,120 L90,150 L210,270 L210,300'
      ])
    });

    it('should negotiate between multiple similar angled paths', function() {
      scope.graph.entities[1].x = 200;
      scope.graph.entities[1].y = 300;
      scope.graph.entities[2].x = 201;
      scope.graph.entities[2].y = 300;
      scope.graph.relationships.push({entity1_id: 0, entity2_id: 2})
      scope.$digest();
      expect(paths()).toEqual([
        'M70,120 L70,150 L210,270 L210,300',
        'M90,120 L90,150 L211,270 L211,300'
      ]);
    });

    it('should be blank if no relationships are defined', function() {
      scope.graph.relationships = [];
      scope.$digest();
      expect(paths()).toEqual([]);
    });
  });

  describe('arrowhead SVG paths', function() {
    beforeEach(inject(function() {
      paths = function() {
        return _.map(scope.graph.arrowheads, function(a) { return a.svgPath(); } );
      }
    }));

    it('should draw a chicken foot', function() {
      scope.graph.entities[1].x = 200;
      scope.graph.entities[1].y =  10;
      scope.$digest();
      //expect(paths()).toEqual([
      //  'M'
      //]);
    });
  })

  it('should set all entities deselected when deselect() is called', function() {
    scope.deselectAll();
    _.map(scope.graph.entities, function(entity) {
      expect(entity.selected).toBe(false);
        'M100,65 L130,65 L170,65 L200,65'
    });
  });

});
