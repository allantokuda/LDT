'use strict';

angular.module('myApp.controllers').controller('EditorCtrl', function($scope) {

  $scope.editor = new Object;
  $scope.graph = new Object;

  $scope.graph.changeToggler = false
  $scope.$watch('graph.changeToggler', function() {
    $scope.editor.saveButtonText = 'Save';
  });
  $scope.editor.saveButtonText = 'Save';

  var graphID;
  var path_regex = /graphs\/(\d+)\/edit/
  var matches = path_regex.exec(window.location.pathname)
  if (matches != null)
    graphID = matches[1]

  if (graphID)
    $.ajax({ url:"/graphs/"+graphID, type:"GET", dataType:"json",
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("AJAX Error: ");
        console.log(textStatus);
      },
      success: function(data, textStatus, jqXHR) {
        $scope.$apply(function() {
          $scope.graph.id = graphID;
          $scope.graph.name = data.name;
          $scope.graph.entities = data.entities;
          $scope.graph.relationships = data.relationships;

          //TEMPORARY: put labels on all endpoints
          _.each($scope.graph.relationships, function(r) {
            r.label1 = 'be';
            r.label2 = 'be';
          });

          $scope.graph.initialize();
        });
      }
    })


  // Click event handlers

  $scope.handleCanvasClick = function(ev) {
    if ($scope.editor.mode == 'new_entity')
      // FIXME: offsetX,offsetY give the wrong result for positioning a new
      // entity if you click inside an existing entity.
      $scope.graph.createEntity(ev.offsetX, ev.offsetY)

    setMode('select');
  }

  $scope.handleEntityClick = function(entity) {
    switch($scope.editor.mode) {
      case 'new_relationship_start':
        $scope.editor.newRelationshipStart = entity
        setMode('new_relationship_end');
        break;
      case 'new_relationship_end':
        $scope.graph.createRelationship($scope.editor.newRelationshipStart, entity)
        setMode('select');
        break;
      case 'delete':
        $scope.graph.deleteEntity(entity);
        setMode('select');
        break;
    }
  }

  $scope.handleRelationshipClick = function(relationship) {
    if ($scope.editor.mode == 'delete') {
      $scope.graph.deleteRelationship(relationship);
      setMode('select');
    }
  }

  $scope.handleAttributeClick = function(entityID, attributeIndex, ev) {
    if ($scope.editor.mode == 'select' && ev.shiftKey) {
      $scope.graph.toggleAttributeIdentifier(entityID, attributeIndex);
    }
  }

  $scope.handleArrowClick = function(arrow, ev) {
    switch($scope.editor.mode) {
      case 'select':
        // Use shift key to toggler identifier
        $scope.graph.switchArrow(arrow,ev.shiftKey);
        break;
      case 'label_pick':
        setMode('label_enter');
        break;
    }
  }

  $scope.save = function () {

    $scope.$apply(function() { $scope.editor.saveButtonText = 'Saving...' });

    var graphData = { id: $scope.graph.id, name: $scope.graph.name }
    graphData.entities      = $scope.graph.entities;
    graphData.relationships = $scope.graph.relationships;

    var encodeData = "graph=" + JSON.stringify(graphData);

    if (graphData.id) {
      $.ajax({ url:"/graphs/"+graphData.id, type:"PUT", dataType:"json", data:encodeData,
        complete: function(data) {
          $scope.$apply(function() { $scope.editor.saveButtonText = 'Saved' });
        }
      })
      }
    else
      $.ajax({
        url:"/graphs", type:"POST", dataType:"json", data:encodeData,
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("AJAX Error: ");
          console.log(textStatus);
        },
        success: function(data, textStatus, jqXHR) {
          $scope.$apply(function() { $scope.editor.saveButtonText = 'Saved' });
          $scope.graph.id = data.id
        }
      });
  }

  // Action buttons / hotkeys

  $scope.select          = function() { $scope.$apply(setMode('select')) }
  $scope.newEntity       = function() { $scope.$apply(setMode('new_entity')); }
  $scope.newRelationship = function() { $scope.$apply(setMode('new_relationship_start')); }
  $scope.delete          = function() { $scope.$apply(setMode('delete')); }
  $scope.label           = function() { $scope.$apply(setMode('label_pick')); }

  function setMode(mode) {
    $scope.editor.mode = mode;

    var modeMessages = {
      select: '',
      new_entity: '',
      new_relationship_start: 'click to start relationship',
      new_relationship_end: 'click to end relationship',
      delete: 'click to delete',
      label_pick: '',
      label_enter: ''
    }

    $scope.editor.entityOverlayMessage = modeMessages[mode];
  }

  setMode('select');
})
