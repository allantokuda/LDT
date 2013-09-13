'use strict';

describe('GraphCtrl', function(){
  var ctrl, scope;
  beforeEach(module('myApp.controllers'));
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('GraphCtrl', {$scope: scope});
  }));

  it('should calculate a path for drawing relationships', function() {
    scope.graph.entities = [{id: 0, x: 0, y: 0}, {id: 1, x: 1, y: 1}]
    scope.graph.relationships = [{entity1_id: 0, entity2_id: 1}]
    expect(scope.graph.linePath()).toNotBe('')
  });

  //TODO: Add spec for actual path to be taken by relationship in real 2-or-more-entity scenario

  it('should be blank if no relationships are defined', function() {
    scope.graph.relationships = []
    expect(scope.graph.linePath()).toBe('')
  });

  it('should be blank if no entities are defined', function() {
    scope.graph.entities = []
    expect(scope.graph.linePath()).toBe('')
  });

  it('should set all entities deselected when deselect() is called', function() {
    scope.deselectAll();
    _.map(scope.graph.entities, function(entity) {
      expect(entity.selected).toBe(false)
    });
  });

});
