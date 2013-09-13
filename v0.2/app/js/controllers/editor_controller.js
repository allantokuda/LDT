'use strict';

angular.module('myApp.controllers').controller('EditorCtrl', function($scope) {

  $scope.editor = new Object;
  $scope.editor.mode = 'select';
  $scope.editor.entityOverlay = false;
  $scope.graph = new Object;

  // Click event handlers

  $scope.handleCanvasClick = function(ev) {
    if ($scope.editor.mode == 'new_entity')
      // FIXME: offsetX,offsetY give the wrong result for positioning a new
      // entity if you click inside an existing entity.
      $scope.graph.createEntity(ev.offsetX, ev.offsetY)

    $scope.editor.mode = 'select';
    $scope.editor.entityOverlayMessage = '';
    $scope.editor.entityOverlay = false;
  }

  $scope.handleEntityClick = function(entity) {
    switch($scope.editor.mode) {
      case 'new_relationship_start':
        $scope.editor.newRelationshipStart = entity
        $scope.editor.entityOverlayMessage = 'click to end relationship';
        $scope.editor.mode = 'new_relationship_end'
        break;
      case 'new_relationship_end':
        $scope.graph.createRelationship($scope.editor.newRelationshipStart, entity)
        $scope.editor.entityOverlay = false;
        $scope.editor.mode = 'select'
        break;
      case 'delete':
        $scope.graph.deleteEntity(entity);
        $scope.editor.entityOverlay = false;
        break;
    }
  }

  // Action buttons / hotkeys

  $scope.select = function() {
    $scope.$apply(function() {
      $scope.editor.mode = 'select';
      $scope.editor.entityOverlay = false;
    });
  }

  $scope.newEntity = function() {
    $scope.$apply(function() {
      $scope.editor.mode = 'new_entity';
      $scope.editor.entityOverlay = false;
    });
  }

  $scope.newRelationship = function() {
    $scope.$apply(function() {
      $scope.editor.mode = 'new_relationship_start';
      $scope.editor.entityOverlay = true;
      $scope.editor.entityOverlayMessage = 'click to begin relationship';
    });
  }

  $scope.delete = function() {
    $scope.$apply(function() {
      $scope.editor.mode = 'delete'
      $scope.editor.entityOverlay = true;
      $scope.editor.entityOverlayMessage = 'click to delete';
    });
  }

})
