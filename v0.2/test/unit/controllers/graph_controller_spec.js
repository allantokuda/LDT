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
      ]
    }));

    it('should calculate a straight horizontal path', function() {
      scope.graph.entities[1].x = 200
      scope.$digest();
      expect(scope.graph.linePaths).toEqual(['M50,50 L250,50'])
      //expect(scope.graph.linePaths).toBe(['M100,50 L200,50'])
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
