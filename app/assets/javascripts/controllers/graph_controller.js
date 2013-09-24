'use strict';

angular.module('myApp.controllers').controller('GraphCtrl', function($scope) {

    var SIDES = ['top', 'bottom', 'left', 'right'];

    // Allow tests to pass on this scope alone, though this scope will actually
    // inherit the definition so that the parent scope can use it.
    if (typeof($scope.graph) == 'undefined')
      $scope.graph = new Object;

    $scope.graph.initialize = function() {

      if (typeof($scope.graph.name) == 'undefined')
        $scope.graph.name = "Untitled graph"

      if (typeof($scope.graph.entities) == 'undefined')
        $scope.graph.entities = []

      if (typeof($scope.graph.relationships) == 'undefined')
        $scope.graph.relationships = []

      if (typeof($scope.graph.endpoints) == 'undefined')
        $scope.graph.endpoints = []

      if (typeof($scope.graph.arrowheads) == 'undefined')
        $scope.graph.arrowheads = []

      if (typeof($scope.graph) == 'undefined')
        $scope.graph.changeToggler = false

      $scope.graph.next_entity_id       = nextID($scope.graph.entities);
      $scope.graph.next_relationship_id = nextID($scope.graph.relationships);
    }

    function nextID(set) {
      if (set.length > 0)
        return _.max(set, function(item) { return item.id }).id + 1;
      else
        return 0;
    }


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
    }
    $scope.cssClass = function(attributeName) {
      return isIdentifier(attributeName) ? 'identifier' : '';
    }

    // Make arrowheads accessible directly off the scope for convenience in rendering
    function setupArrowheads() {
      $scope.graph.arrowheads = []
      _.each($scope.graph.decoratedRelationships, function(r) {
        decorateEndpoint(r.endpoint1, r.symbol1, 1);
        decorateEndpoint(r.endpoint2, r.symbol2, 2);
        $scope.graph.arrowheads.push(r.endpoint1);
        $scope.graph.arrowheads.push(r.endpoint2);
      });
    }

    $scope.graph.toggleAttributeIdentifier = function(entityID, attributeIndex) {
      var entity = _.find($scope.graph.entities, function(e) { return e.id == entityID });
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

    $scope.graph.switchArrow = function(arrow, switchIdentifier) {
      var relationship = _.find($scope.graph.relationships, function(r) {
        return r.id == arrow.relationship_id
      });
      var symbol = relationship['symbol' + arrow.relationship_ending]

      if (switchIdentifier) {
        switch(symbol) {
          case 'none':                   symbol = 'identifier'; break;
          case 'identifier':             symbol = 'none'; break;
          case 'chickenfoot':            symbol = 'chickenfoot_identifier'; break;
          case 'chickenfoot_identifier': symbol = 'chickenfoot'; break;
          case '?':                      symbol = 'identifier'; break;
        }
      } else {
        switch(symbol) {
          case 'none':                   symbol = 'chickenfoot'; break;
          case 'chickenfoot':            symbol = 'none'; break;
          case 'identifier':             symbol = 'chickenfoot_identifier'; break;
          case 'chickenfoot_identifier': symbol = 'identifier'; break;
          case '?':                      symbol = 'none'; break;
        }
      }
      relationship['symbol' + arrow.relationship_ending] = symbol;
    }

    $scope.graph.createEntity = function(locX,locY) {
      $scope.graph.entities.push({
        id: $scope.graph.next_entity_id++,
        x: locX,
        y: locY,
        width: 120,
        height: 150,
        name: "New Entity",
        attributes: ""
      })
    }

    $scope.graph.createRelationship = function(entity1, entity2) {
      $scope.graph.relationships.push({
        id: $scope.graph.next_relationship_id++,
        entity1_id: entity1.id,
        entity2_id: entity2.id,
        symbol1: '?',
        symbol2: '?'
      });
    }

    $scope.graph.deleteEntity = function(entity_to_delete) {
      // Remove all connected relationships
      $scope.graph.relationships = _.reject($scope.graph.relationships, function(r) {
        return r.entity1_id == entity_to_delete.id || r.entity2_id == entity_to_delete.id
      });

      // Remove entity
      $scope.graph.entities = _.reject($scope.graph.entities, function(e) {
        return e.id == entity_to_delete.id
      });
    }

    $scope.graph.deleteRelationship = function(relationship_to_delete) {
      $scope.graph.relationships = _.reject($scope.graph.relationships, function(r) {
        return r.id == relationship_to_delete.id
      });
    }

    $scope.deselectAll = function() {
      _.each($scope.graph.entities, function(entity) {
        entity.selected = false;
      })
    }
  });

