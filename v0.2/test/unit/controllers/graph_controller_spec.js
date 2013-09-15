'use strict';

describe('GraphCtrl', function(){
  var ctrl, scope;
  beforeEach(module('myApp.controllers'));
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('GraphCtrl', {$scope: scope});
  }));

  describe('svgPath', function() {
    var paths;

    beforeEach(inject(function() {
      scope.graph.relationships = [{entity1_id: 0, entity2_id: 1}]
      scope.graph.entities = [
        {id: 0, x: 0, y: 0, width: 100, height: 120},
        {id: 1, x: 0, y: 0, width: 100, height: 120},
        {id: 2, x: 0, y: 0, width: 100, height: 120}
      ]

      paths = function() {
        return _.map(scope.graph.decoratedRelationships, function(r) { return r.svgPath(); } );
      }
    }));

    it('should calculate a straight horizontal path', function() {
      scope.graph.entities[1].x = 200
      scope.graph.entities[1].y =  10
      scope.$digest();
      expect(paths()).toEqual([
        'M100,65 L130,65 L170,65 L200,65'
      ]);
    });

    it('should calculate a straight horizontal path when marginally possible', function() {
      scope.graph.entities[1].x = 200
      scope.graph.entities[1].y = 100
      scope.$digest();
      expect(paths()).toEqual([
        'M100,110 L130,110 L170,110 L200,110'
      ]);
    });

    it('should calculate a straight vertical path', function() {
      scope.graph.entities[1].x =  10
      scope.graph.entities[1].y = 200
      scope.$digest();
      expect(paths()).toEqual([
        'M55,120 L55,150 L55,170 L55,200'
      ]);
    });

    it('should calculate an angled path', function() {
      scope.graph.entities[1].x = 200
      scope.graph.entities[1].y = 300
      scope.$digest();
      expect(paths()).toEqual([
        'M90,120 L90,150 L210,270 L210,300'
      ])
    });

    it('should negotiate between multiple similar angled paths', function() {
      scope.graph.entities[1].x = 200
      scope.graph.entities[1].y = 300
      scope.graph.entities[2].x = 201
      scope.graph.entities[2].y = 300
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

    // TODO add more scenarios!
  });

  it('should set all entities deselected when deselect() is called', function() {
    scope.deselectAll();
    _.map(scope.graph.entities, function(entity) {
      expect(entity.selected).toBe(false);
    });
  });

});
