'use strict';

function GraphCtrl($scope) {

  // Allow tests to pass on this scope alone, though this scope will actually
  // inherit the definition so that the parent scope can use it.
  if (typeof($scope.graph) == 'undefined')
    $scope.graph = new Object;

  $scope.graph.initialize = function() {

    if (typeof($scope.graph.name) == 'undefined')
      $scope.graph.name = "Untitled graph";

    if (typeof($scope.graph.entities) == 'undefined')
      $scope.graph.entities = [];

    if (typeof($scope.graph.relationships) == 'undefined')
      $scope.graph.relationships = [];

    if (typeof($scope.graph.endpoints) == 'undefined')
      $scope.graph.endpoints = [];

    if (typeof($scope.graph) == 'undefined')
      $scope.graph.changeToggler = false;

    $scope.graph.next_entity_id       = nextID($scope.graph.entities);
    $scope.graph.next_relationship_id = nextID($scope.graph.relationships);


    $scope.$watch('graph.name', function(newValue, oldValue) {
      $scope.$emit('titlechange', newValue);
    });

    $scope.$broadcast('initializeEndpoints');
  };

  function nextID(set) {
    if (set.length > 0)
      return _.max(set, function(item) { return item.id; }).id + 1;
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
  };
  $scope.cssClass = function(attributeName) {
    return isIdentifier(attributeName) ? 'identifier' : '';
  };

  $scope.graph.toggleAttributeIdentifier = function(entityID, attributeIndex) {
    var entity = _.find($scope.graph.entities, function(e) { return e.id == entityID; });
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

  $scope.graph.createEntity = function(locX,locY) {
    $scope.graph.entities.push(new Entity({
      id: $scope.graph.next_entity_id,
      x: locX,
      y: locY,
      width: 120,
      height: 150,
      name: "New Entity",
      attributes: ""
    }));
    $scope.graph.next_entity_id++;
  };

  $scope.graph.createRelationship = function(entity1, entity2) {
    var id = $scope.graph.next_relationship_id++;
    var r = new Relationship(id, entity1, entity2);
    $scope.graph.addRelationship(r);
    return r;
  };

  $scope.graph.addRelationship = function(r) {
    $scope.graph.relationships.push(r);
    $scope.graph.endpoints.push(r.endpoints[0]);
    $scope.graph.endpoints.push(r.endpoints[1]);

    r.endpoints[0].relocate();
    r.endpoints[1].relocate();
    r.endpoints[0].negotiateCoordinates();
    r.endpoints[1].negotiateCoordinates();
  };

  $scope.graph.deleteEntity = function(entity_to_delete) {

    var endpoints_to_delete = entity_to_delete.clearAllEndpoints();

    // Delete endpoints from associated entities' sides
    _.each($scope.graph.entities, function(entity) {
      _.each(endpoints_to_delete, function(endpoint) {
        entity.removeEndpoint(endpoint.partner);
      });
    });

    // Remove all connected relationships
    $scope.graph.relationships = _.reject($scope.graph.relationships, function(r) {
      return r.endpoints[0].entity == entity_to_delete || r.endpoints[1].entity == entity_to_delete;
    });

    // Remove all connected endpoints
    $scope.graph.endpoints = _.reject($scope.graph.endpoints, function(endpoint) {
      return endpoint.entity      == entity_to_delete ||
             endpoint.otherEntity == entity_to_delete;
    });

    // Remove entity
    $scope.graph.entities = _.reject($scope.graph.entities, function(e) {
      return e == entity_to_delete;
    });
  };

  $scope.graph.deleteRelationship = function(relationship_to_delete) {
    var endpoints = relationship_to_delete.endpoints;

    _.each(endpoints, function(endpoint_to_delete) {

      // Remove connected endpoints from sides
      _.each($scope.graph.entities, function(entity) {
      });

      // Remove all connected endpoints from graph
      $scope.graph.endpoints = _.without($scope.graph.endpoints, endpoint_to_delete);
    });

    // Remove relationship
    $scope.graph.relationships = _.without($scope.graph.relationships, relationship_to_delete);
  };

  $scope.deselectAll = function() {
    _.each($scope.graph.entities, function(entity) {
      entity.selected = false;
    });
  };

  $scope.$on('entityGeometryChange', function(ev, entityID) {
    $scope.$broadcast('relocateIfAttachedToEntity', entityID);
  });
}

angular.module('myApp.controllers').controller('GraphCtrl', GraphCtrl);

// For minification
GraphCtrl.$inject = ['$scope'];
