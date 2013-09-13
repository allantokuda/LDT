'use strict';

describe('EditorCtrl', function(){
  var ctrl, scope;
  beforeEach(module('myApp.controllers'));
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('EditorCtrl', {$scope: scope});
  }));

  describe('handleCanvasClick', function() {
    it('should reset the state to select', function() {
      scope.editor.mode = 'other';
      scope.handleCanvasClick(null);
      expect(scope.editor.mode).toBe('select')
    });

    it('should call the graph create entity method', function() {
      scope.editor.mode = 'new_entity';
      // Stub the method since it is not defined in this scope
      scope.graph.createEntity = function() { return null }
      spyOn(scope.graph, 'createEntity')
      scope.handleCanvasClick({offsetX: 0, offsetY: 0});
      expect(scope.graph.createEntity).toHaveBeenCalled();
    });
  });

  describe('handleEntityClick', function() {
    it('should cycle the new relationship state from start to end', function() {
      scope.editor.mode = 'new_relationship_start';
      scope.handleEntityClick(null);
      expect(scope.editor.mode).toBe('new_relationship_end')
    });

    it('should return the editor state to select', function() {
      // Stub
      scope.graph.createRelationship = function() { return null };

      scope.editor.mode = 'new_relationship_end';
      scope.handleEntityClick(null);
      expect(scope.editor.mode).toBe('select')
    });
  });
});
