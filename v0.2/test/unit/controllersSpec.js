'use strict';

/* jasmine specs for controllers go here */

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
    expect(scope.editor.linePath()).toNotBe('')
  });

  //TODO: Add spec for actual path to be taken by relationship in real 2-or-more-entity scenario

  it('should be blank if no relationships are defined', function() {
    scope.graph.relationships = []
    expect(scope.editor.linePath()).toBe('')
  });

  it('should be blank if no entities are defined', function() {
    scope.graph.entities = []
    expect(scope.editor.linePath()).toBe('')
  });

  describe('keybindings', function() {

    var key_event = $.Event('keypress')

    it('should switch to new entity mode when the "e" key is pressed', function() {
      key_event.charCode = 101;
      $(window).trigger(key_event);
      expect(scope.editor.mode).toBe('new_entity')
    });

    it('should switch to new relationship start mode when the "r" key is pressed', function() {
      key_event.charCode = 114;
      $(window).trigger(key_event);
      expect(scope.editor.mode).toBe('new_relationship_start')
    });
  });
});
