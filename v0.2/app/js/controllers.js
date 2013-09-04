'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('GraphCtrl', function($scope) {
    // Set initial edit mode
    $scope.editor = new Object
    $scope.graph = new Object
    $scope.editor.mode = 'select';

    // Define some test data (TODO: load and persist to server)
    var e = $scope.graph.entities = []
    e.push({id: 0, x:  20, y:  20, width: 100, height: 130, name: "Supplier",  attributes: ["name", "location"] })
    e.push({id: 1, x: 220, y:  20, width: 100, height: 130, name: "Part",      attributes: ["size", "shape", "color"] })
    e.push({id: 2, x: 120, y: 190, width: 100, height: 130, name: "Inventory", attributes: ["quantity"] })

    var r = $scope.graph.relationships = []
    r.push({ id: 0, entity1_id: 0, entity2_id: 2, label1: true, label2: false, symbol1: 'one', symbol2: 'many' })
    r.push({ id: 1, entity1_id: 1, entity2_id: 2, label1: true, label2: false, symbol1: 'one', symbol2: 'many' })

    function entityCenterCoord(e) {
      return (e.x * 1 + e.width / 2) + "," + (e.y * 1 + e.height / 2)
    }

    // Draw a simple line for each relationship
    // TODO: Put in fancier logic for drawing L-shaped relationships
    $scope.editor.linePath = function(){
      if ($scope.graph.entities.length > 0)
        return _.map($scope.graph.relationships, function(relationship) {
          var e1 = _.find($scope.graph.entities, function(e) { return e.id == relationship.entity1_id })
          var e2 = _.find($scope.graph.entities, function(e) { return e.id == relationship.entity2_id })

          if (e1 && e2) return "M" + entityCenterCoord(e1) + " L" + entityCenterCoord(e2)
        }).join(" ")
      else
        return ''
    };

    // Switch modes using keyboard
    $(window).keypress(function(e) {
      switch (e.charCode) {
        case 13:  /* Enter */ $scope.$apply(function() { $scope.editor.mode = 'select'; } ); break;
        case 101: /* e     */ $scope.$apply(function() { $scope.editor.mode = 'new_entity'; } ); break;
        case 114: /* r     */ $scope.$apply(function() { $scope.editor.mode = 'new_relationship_start'; } ); break;
      }
    })

    // Respond to click event to complete an action
    $("#canvas").click(function(e) {
      $scope.$apply(function() {
        if ($scope.editor.mode == 'new_entity') {
          // FIXME: offsetX,offsetY give the wrong result for positioning a new entity if you click inside an existing entity.
          var num = $scope.graph.entities.length
          $scope.graph.entities.push({id: num, x: e.offsetX, y: e.offsetY, width: 100, height: 130, name: "New Entity", attributes: ["new_entity_id"]})
        }
        $scope.editor.mode = 'select'
      })
    });

    $scope.beginRelationship = function(entity) {
      $scope.editor.newRelationshipStart = entity
      $scope.editor.mode = 'new_relationship_end'
    }

    $scope.endRelationship = function(entity) {
      var num = $scope.graph.relationships.length
      var start_id = $scope.editor.newRelationshipStart.id
      $scope.graph.relationships.push({id: num, entity1_id: start_id, entity2_id: entity.id, symbol1: '?', symbol2: '?'})
      $scope.editor.mode = 'select'
    }
  });

