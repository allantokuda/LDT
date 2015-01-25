'use strict';

describe('EditorCtrl', function(){
  var ctrl, scope, GraphStore;
  beforeEach(module('LDT.controllers'));
  beforeEach(inject(function ($rootScope, $controller, _GraphStore_) {
    scope = $rootScope.$new();
    ctrl = $controller('EditorCtrl', {$scope: scope});
    GraphStore = _GraphStore_;
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
      GraphStore.createEntity = function() { return null }
      spyOn(GraphStore, 'createEntity')
      scope.handleCanvasClick({pageX: 0, pageY: 0});
      expect(GraphStore.createEntity).toHaveBeenCalled();
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
      GraphStore.createRelationship = function() { return null };

      scope.editor.mode = 'new_relationship_end';
      scope.handleEntityClick(null);
      expect(scope.editor.mode).toBe('select')
    });
  });

  describe('event handling', function() {
    it('should catch and rebroadcast entityGeometryChange events', function() {
      spyOn(scope, '$broadcast');
      scope.$emit('entityGeometryChange', 42);
      expect(scope.$broadcast).toHaveBeenCalledWith('relocateIfAttachedToEntity', 42);
    });
  });
});
