'use strict';

var app = angular.module('LDT.controllers');

// This controller is at the top of the application and bootstraps it.
// - Instantiates $scope.editor which contains editor UI state
// - Defines editor event handlers
app.controller('EditorCtrl', ['$scope', '$timeout', 'GraphStore', 'SyntaxAnalyzer', function($scope, $timeout, GraphStore, SyntaxAnalyzer) {

  var GUIDE_ENABLED = "guideEnabled";

  $scope.editor = {};
  $scope.graph = GraphStore.graph;
  $scope.graph.pan = { x: 0, y: 0 };
  $scope.graph.zoom = 1;
  $scope.status_message = 'Loading...';

  $scope.getting_started_messages = [
    {
      message: "Click here and then click in the canvas area below to create a new entity.",
      left: '8.5em'
    },
    {
      message: "Once you've created some entities, click here and then choose two entities to create a relationship between them.",
      left: '19em'
    }
  ];
	$scope.guideEnabled = localStorage.getItem(GUIDE_ENABLED) !== null || false;

  $scope.$watch('graph.name', function(newValue, oldValue) {
    $scope.$emit('titlechange', newValue);
  });


  //TODO: use Angular router to handle this more cleanly
  var graphID;
  var path_regex = /graphs\/([^\/]+)\/edit/;
  var matches = path_regex.exec(window.location.pathname);
  if (matches !== null)
    graphID = matches[1];

  if (graphID) {
    GraphStore.load(graphID).then(
      function(graph) {

        // Update SVG size in next digest loop, after the DOM has rendered,
        // to account for the actual locations of the entities
        $timeout(function() {
          $scope.updateSvgSize();
        });

        if (GraphStore.graph.entities.length == 0) {
          $scope.getting_started_message_num = 0;
        }

        updateAnnotations();
      }
    );
  }

  function updateAnnotations() {
    $scope.relationshipAnnotations = SyntaxAnalyzer.getRelationshipAnnotations();
  }

  // Click event handlers

  $scope.handleCanvasClick = function(x,y) {
    if ($scope.editor.mode == 'new_entity') {
      GraphStore.createEntity(x - $scope.graph.pan.x, y - $scope.graph.pan.y);
    }

    setMode('select');

    $scope.updateSvgSize();
    updateAnnotations();
  };

  $scope.handleEntityClick = function(entity) {
    switch($scope.editor.mode) {
      case 'new_relationship_start':
        $scope.editor.newRelationshipStart = entity;
        setMode('new_relationship_end');
        break;
      case 'new_relationship_end':
        GraphStore.createRelationship($scope.editor.newRelationshipStart, entity);
        setMode('select');
        break;
      case 'delete_item':
        GraphStore.deleteEntity(entity);
        setMode('select');
        break;
      default:
        break;
    }

    updateAnnotations();
  };

  $scope.handleRelationshipClick = function(relationship) {
    if ($scope.editor.mode == 'delete_item') {
      GraphStore.deleteRelationship(relationship);
      setMode('select');
    }

    updateAnnotations();
  };

  $scope.handleAttributeClick = function(entityID, attributeIndex, ev) {
    if ($scope.editor.mode == 'identifier_bar') {
      $scope.toggleAttributeIdentifier(entityID, attributeIndex);
    }

    updateAnnotations();
  };

  $scope.handleArrowClick = function(arrow, ev) {
    switch($scope.editor.mode) {
      case 'degree':
        arrow.toggleArrowhead(false);
        break;
      case 'identifier_bar':
        arrow.toggleArrowhead(true);
        break;
      case 'label_pick':
        arrow.selected = true;
        setMode('select');
        break;
      default:
        break;
    }

    updateAnnotations();
  };

  function setSaveMessage(status, message) {
    $('#save-message').show();
    $scope.editor.saveStatus = status;
    $scope.editor.saveMessage = message;
  }

  function fadeSaveMessage() {
    setTimeout(function() {
      $('#save-message').fadeOut();
    }, 3000); // after 3 seconds
  }

  $scope.saveCommand = function() {
    setSaveMessage('pending', 'Saving...');
    GraphStore.save().then(
      function() { setSaveMessage('success', 'Saved'); fadeSaveMessage(); },
      function() { setSaveMessage('error', 'Save Failed!'); }
    );
  };

  $scope.updateSvgSize = function() {
    $('#svg-paths').width (0);
    $('#svg-paths').height(0);
    $('#canvas'   ).width (0);
    $('#canvas'   ).height(0);
    $('#svg-paths').width ($(document).width()  / ($scope.graph.zoom) + 10);
    $('#svg-paths').height($(document).height() / ($scope.graph.zoom) + 10);
    $('#canvas'   ).width ($(document).width()  / ($scope.graph.zoom));
    $('#canvas'   ).height($(document).height() / ($scope.graph.zoom));
  };

  //TODO: move "identifier" methods into a domain specific class.
  //The logic here is that an attribute is a one-line (delimined by newlines)
  //substring of the "attributes" text field on an entity, and that an
  //attribute is an "identiifer" of its entity if it ends with an asterisk. The
  //UI layer hides the asterisk except in edit mode, replacing it with an
  //underline. This is all domain-specific logic.
  function isIdentifier(attributeName) {
    return attributeName.substr(attributeName.length - 1) == '*';
  }

  function removeIdentifier(attributeName) {
    return attributeName.substr(0,attributeName.length - 1);
  }

  function addIdentifier(attributeName) {
    return attributeName + '*';
  }

  // Would love to eliminate these helpers. The attributes stopped responding to a double click event
  // when I sent an attribute object with this information pre-populated. Calling these helpers instead
  // somehow solved the problem.
  $scope.removeIdentifierIfPresent = function(attributeName) {
    return isIdentifier(attributeName) ? removeIdentifier(attributeName) : attributeName;
  };
  $scope.cssClass = function(attributeName) {
    return isIdentifier(attributeName) ? 'identifier' : '';
  };

  $scope.toggleAttributeIdentifier = function(entityID, attributeIndex) {
    var entity = _.find(GraphStore.graph.entities, function(e) { return e.id == entityID; });
    var splitAttributes = entity.attributes.split("\n");

    if (attributeIndex < splitAttributes.length) {
      var attributeName = splitAttributes[attributeIndex];

      if (isIdentifier(attributeName))
        attributeName = removeIdentifier(attributeName);
      else
        attributeName = addIdentifier(attributeName);

      splitAttributes[attributeIndex] = attributeName;
      entity.attributes = splitAttributes.join("\n");
    }
  };

  $scope.$on('entityGeometryChange', function(ev, entityID) {
    $scope.$broadcast('relocateIfAttachedToEntity', entityID);
  });

  function afterClickNewEntityButton() {
    hideGhostEntityPriorToDragEvent();
    $scope.getting_started_message_num = -1;
  }

  function hideGhostEntityPriorToDragEvent() {
    $('.ghost-entity').css('left', '-1000px');
    $('.ghost-entity').css('top', '-1000px');
  }

  // TODO consider moving this to a directive
  $(document).mouseup($scope.updateSvgSize);

  // Action buttons / hotkeys

  $scope.newCommand             = function() { window.location = '/graphs/new'; };
  $scope.openCommand            = function() { window.location = '/graphs/'; };
  $scope.selectCommand          = function() { $scope.$apply(setMode('select')); };
  $scope.newEntityCommand       = function() { afterClickNewEntityButton(); $scope.$apply(setMode('new_entity')); };
  $scope.newRelationshipCommand = function() { $scope.$apply(setMode('new_relationship_start')); };
  $scope.deleteItemCommand      = function() { $scope.$apply(setMode('delete_item')); };
  $scope.labelCommand           = function() { $scope.$apply(setMode('label_pick')); };
  $scope.degreeCommand          = function() { $scope.$apply(setMode('degree')); };
  $scope.identifierBarCommand   = function() { $scope.$apply(setMode('identifier_bar')); };
  $scope.zoomInCommand          = function() { $scope.$apply($scope.graph.zoom *= 1.5); $scope.updateSvgSize(); };
  $scope.zoomOutCommand         = function() { $scope.$apply($scope.graph.zoom /= 1.5); $scope.updateSvgSize(); };
  $scope.guideCommand           = function() { $scope.$apply(toggleGuide()); };

  function setMode(mode) {
    $scope.editor.mode = mode;

    var modeMessages = {
      select: '',
      new_entity: '',
      new_relationship_start: 'click to start relationship',
      new_relationship_end: 'click to end relationship',
      delete_item: 'click to delete',
      label_pick: ''
    };

    $scope.editor.entityOverlayMessage = modeMessages[mode];
  }

  setMode('select');

	function toggleGuide() {
		$scope.guideEnabled = !$scope.guideEnabled;

    if ($scope.guideEnabled) {
      localStorage.setItem(GUIDE_ENABLED, true);
    } else {
      localStorage.removeItem(GUIDE_ENABLED);
    }
	}

}]);
