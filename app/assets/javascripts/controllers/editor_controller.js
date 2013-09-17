'use strict';

angular.module('myApp.controllers').controller('EditorCtrl', function($scope) {

  $scope.editor = new Object;
  $scope.graph = new Object;

  var graphID = /graphs\/(\d+)\/edit/.exec(window.location.pathname)[1]

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
        });

        console.log(data);
      }
    })

  console.log(graphID)


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

  $scope.switchArrow = function(arrow, ev) {
    if ($scope.editor.mode == 'select') {
      // Use shift key to toggler identifier
      if (ev.shiftKey)
        $scope.graph.switchArrow(arrow,true);
      else
        $scope.graph.switchArrow(arrow);
    }
  }

  // Action buttons / hotkeys

  $scope.select = function() {
    $scope.$apply(function() {
      $scope.editor.mode = 'select';
      $scope.editor.entityOverlayMessage = '';
    });
  }

  $scope.newEntity = function() {
    $scope.$apply(function() {
      $scope.editor.mode = 'new_entity';
      $scope.editor.entityOverlayMessage = '';
    });
  }

  $scope.newRelationship = function() {
    $scope.$apply(function() {
      $scope.editor.mode = 'new_relationship_start';
      $scope.editor.entityOverlayMessage = 'click to begin relationship';
    });
  }

  $scope.delete = function() {
    $scope.$apply(function() {
      setMode('delete')
    });
  }

  $scope.save = function () {

    $('#save-button').css('background','#999');

    var graphData = { id: $scope.graph.id, name: $scope.graph.name }
    graphData.entities      = $scope.graph.entities;
    graphData.relationships = $scope.graph.relationships;

    var encodeData = "graph=" + JSON.stringify(graphData);

    if (graphData.id) {
      $.ajax({ url:"/graphs/"+graphData.id, type:"PUT", dataType:"json", data:encodeData,
        success: function(data) {
          console.log('hello?');
          $('#save-button').css('background', 'inherit');
        }
      })
      console.log('hello!')
      }
    else
      $.ajax({
        url:"/graphs", type:"POST", dataType:"json", data:encodeData,
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("AJAX Error: ");
          console.log(textStatus);
        },
        success: function(data, textStatus, jqXHR) {
          $('#save-button').css('background', 'inherit');
          console.log(data.id);
          $scope.graph.id = data.id
        }
      });
  }

  function setMode(mode) {
    $scope.editor.mode = mode;

    var modeMessages = {
      select: '',
      new_entity: '',
      new_relationship_start: 'click to start relationship',
      new_relationship_end: 'click to end relationship',
      delete: 'click to delete'
    }

    $scope.editor.entityOverlayMessage = modeMessages[mode];
  }

  setMode('select');
})
