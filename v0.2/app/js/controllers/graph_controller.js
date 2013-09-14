'use strict';

angular.module('myApp.controllers').controller('GraphCtrl', function($scope) {

    // Allow tests to pass on this scope alone, though this scope will actually
    // inherit the definition so that the parent scope can use it. TODO: rearchitect this.
    if (typeof($scope.graph) == 'undefined')
      $scope.graph = new Object;

    // Define some test data (TODO: load and persist to server)
    var e = $scope.graph.entities = [];
    e.push({id: 0, x:  20, y:  20, width: 100, height: 130, name: "Supplier",  attributes: "name\nlocation" });
    e.push({id: 1, x: 220, y:  20, width: 100, height: 130, name: "Part",      attributes: "size\nshape\ncolor" });
    e.push({id: 2, x: 120, y: 190, width: 100, height: 130, name: "Inventory", attributes: "quantity" });
    $scope.graph.next_entity_id = 3;

    var r = $scope.graph.relationships = [];
    r.push({ id: 0, entity1_id: 0, entity2_id: 2, label1: true, label2: false, symbol1: 'one', symbol2: 'many' });
    r.push({ id: 1, entity1_id: 1, entity2_id: 2, label1: true, label2: false, symbol1: 'one', symbol2: 'many' });
    $scope.graph.next_relationship_id = 2;

    function decoratedEntity(entity) {
      entity.coordinates = function(xloc,yloc) {
        return {
          x: Math.round(this.x + this.width  * xloc),
          y: Math.round(this.y + this.height * yloc)
        }
      }
      entity.center = function() {
        return this.coordinates(0.5,0.5)
      }

      return entity;
    }

    function entityByID(id) {
      return decoratedEntity(
        _.find($scope.graph.entities, function(e) {
          return e.id == id
        })
      );
    }

    // Expensive watch operation here, but it seems to work well for this application.
    // http://stackoverflow.com/questions/14712089/how-to-deep-watch-an-array-in-angularjs
    $scope.$watch(stringifyGraph, calculateLinePaths);

    function stringifyGraph() {
      return JSON.stringify($scope.graph.entities) +
             JSON.stringify($scope.graph.relationships)
    }

    function calculateLinePaths() {
      $scope.graph.linePaths = _.map($scope.graph.relationships, function(r) {
        var entity1 = entityByID(r.entity1_id)
        var entity2 = entityByID(r.entity2_id)

        if (entity1 != undefined && entity2 != undefined) {
          // TODO finish filling in linepath logic

          return "M" + entity1.center().x + ',' + entity1.center().y +
                " L" + entity2.center().x + ',' + entity2.center().y
        } else { return "" }
      });
    }

    $scope.closer_to_vertical_than_horizontal = function(entity1, entity2) {
      entity_positions = [[0,0],[0,1],[1,1],[1,0]]
      min_dist = null

      // Find closest two corners between the two entities
      for (pos1 in entity_positions) {
        coord1 = entityCoordinates(entity1, pos1[0], pos1[1])

        for (pos2 in entity_positions) {
          coord2 = entityCoordinates(entity2, pos2[0], pos2[1])

          // Manhattan distance for simplicity
          dist_x = Math.abs(coord1.x - coord2.x)
          dist_y = Math.abs(coord1.y - coord2.y)
          dist = dist_x + dist_y

          if (min_dist == null || dist < min_dist) {
            min_dist = dist
            result = dist_x < dist_y
          }
        }
      }

      return result;
    }


    $scope.graph.createEntity = function(locX,locY) {
      $scope.graph.entities.push({
        id: $scope.graph.next_entity_id++,
        x: locX,
        y: locY,
        width: 120,
        height: 150,
        name: "New Entity",
        attributes: "new_entity_id"
      })
    }

    $scope.graph.createRelationship = function(entity1, entity2) {
      $scope.graph.relationships.push({
        id: $scope.editor.next_relationship_id++,
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

    $scope.deselectAll = function() {
      _.each($scope.graph.entities, function(entity) {
        entity.selected = false;
      })
    }
  });

