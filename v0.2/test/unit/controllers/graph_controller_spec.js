'use strict';

describe('GraphCtrl', function(){
  var ctrl, scope;
  beforeEach(module('myApp.controllers'));
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('GraphCtrl', {$scope: scope});
  }));

  describe('linePath', function() {
    beforeEach(inject(function() {
      scope.graph.relationships = [{entity1_id: 0, entity2_id: 1}]
      scope.graph.entities = [
        {id: 0, x: 0, y: 0, width: 100, height: 100},
        {id: 1, x: 0, y: 0, width: 100, height: 100},
        {id: 2, x: 0, y: 0, width: 100, height: 100}
      ]
    }));

    it('should calculate a straight horizontal path', function() {
      scope.graph.entities[1].x = 200
      scope.$digest();
      expect(scope.graph.linePaths).toEqual(['M100,50 L130,50 L170,50 L200,50'])
    });

    it('should calculate a straight vertical path', function() {
      scope.graph.entities[1].y = 200
      scope.$digest();
      expect(scope.graph.linePaths).toEqual(['M50,100 L50,130 L50,170 L50,200'])
    });

    it('should calculate an angled path', function() {
      scope.graph.entities[1].x = 200
      scope.graph.entities[1].y = 300
      scope.$digest();
      expect(scope.graph.linePaths).toEqual(['M90,100 L90,130 L210,270 L210,300'])
    });

    it('should negotiate between multiple similar angled paths', function() {
      scope.graph.entities[1].x = 200
      scope.graph.entities[1].y = 300
      scope.graph.entities[2].x = 201
      scope.graph.entities[2].y = 300
      scope.graph.relationships.push({entity1_id: 0, entity2_id: 2})
      scope.$digest();
      expect(scope.graph.linePaths).toEqual([
        'M70,100 L70,130 L210,270 L210,300',
        'M90,100 L90,130 L211,270 L211,300'
      ]);
    });

    it('should be blank if no relationships are defined', function() {
      scope.graph.relationships = [];
      scope.$digest();
      expect(scope.graph.linePaths).toEqual([]);
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
