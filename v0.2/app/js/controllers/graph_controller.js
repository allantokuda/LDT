'use strict';

angular.module('myApp.controllers').controller('GraphCtrl', function($scope) {

    var ARROWHEAD_SIZE = 20
    var SIDES = ['top', 'bottom', 'left', 'right'];


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
      entity.corners = function() {
        return _.map( [[0,0],[0,1],[1,1],[1,0]], function(loc) {
          this.coordinates(loc[0], loc[1])
        });
      }
      entity.nearestCorner = function(point) {
        return _.reduce(corners,
          function(closest, corner) {
            //Manhattan distance
            dist = Math.pow(point.x - corner.x, 2) +
                   Math.pow(point.x - corner.x, 2)

            if (closest == null || dist < closest.dist)
              return {dist: dist, corner: corner}
            else
              return closest
          },
          null // start with unknown closest corner
        ).corner;
      }
      entity.nearestSide = function(point) {
        return _.reduce([
          { name: 'top',    dist: Math.abs(point.y - this.y              ) },
          { name: 'bottom', dist: Math.abs(point.y - this.y - this.height) },
          { name: 'left',   dist: Math.abs(point.x - this.x              ) },
          { name: 'right',  dist: Math.abs(point.x - this.x - this.width ) }
        ], function(closest, side) {
          if (closest == null || side.dist < closest.dist)
            return side
          else
            return closest
        }, null).name;
      }

      entity.along = function(side, point) {
        if (side == 'top' || side == 'bottom')
          return point.x
        else
          return point.y
      }

      entity.default_endpoint_bounds = function(side) {
        var offset;
        if (side == 'top' || side == 'bottom')
          offset = this.width / 2 - ARROWHEAD_SIZE / 2;
        else
          offset = this.height / 2 - ARROWHEAD_SIZE / 2;

        return {min: -offset, max: offset}
      }

      // To be called by each relationship, to get a list of needing relationships
      entity.requestEndpoint = function(relationship_id, other_entity) {
        var side = this.nearestSide(other_entity.center);
        var center_to_center = this.along(side, other_entity.center) -
                               this.along(side, this.center);

        var max_straight_line_offset = (this.height + other_entity.height) / 2 - ARROWHEAD_SIZE
        var ideal_offset = (this.height - ARROWHEAD_SIZE) / 2 *
                           center_to_center / max_straight_line_offset

        this.endpoints[side].push({
          relationship_id: relationship_id,
          ideal_offset: ideal_offset
        })
      }

      entity.negotiateEndpointsOnEachSide = function() {
        callFunc = function(side) { this.negotiateEndpoints(side) }
        _.each(SIDES, _.bind(callFunc, this))
      }

      // To be called once per draw, AFTER all relationships have made an endpoint request
      entity.negotiateEndpoints = function(side) {
        // Sort all endpoints on this side of the entity
        _.sortBy(this.endpoints[side], function(endpoint) {
          Math.abs(endpoint.ideal_offset)
        });

        // Loop through each endpoint
        _.each(this.endpoints[side], function(endpoint) {

          // Ideal offset falls naturally in the allowed area -> let it be exactly there
          if(ideal_offset > this.endpoint_bounds[side].min &&
             ideal_offset < this.endpoint_bounds[side].max) {
            endpoint.offset = ideal_offset

          // Ideal offset is below the allowed area
          } else if (ideal_offset <= this.endpoint_bounds[side].min) {
            endpoint.offset = this.endpoint_bounds[side].min

          // Ideal offset is above the allowed area
          } else if (ideal_offset >= this.endpoint_bounds[side].max) {
            endpoint.offset = this.endpoint_bounds[side].max
          }

          // Finally close up the allowed area for the next relationship.
          // Connection point is above center so bring down the max
          if (ideal_offset > 0)
            this.endpoint_bounds[side].max = ideal_offset - ARROWHEAD_SIZE
          // Connection point is below center so bring up the min
          else
            this.endpoint_bounds[side].min = ideal_offset + ARROWHEAD_SIZE
        });
      }

      // To be called by each relationship to get its final (negotiated) endpoint
      entity.finalEndpoint = function(relationship_id) {
      }

      entity.initialize = function() {
        this.endpoints = _.object(SIDES, [[], [], [], []]);
        var boundsFunc = function(side) {
          return this.default_endpoint_bounds(side)
        };
        this.endpoint_bounds = _.object(SIDES, _.map(SIDES, _.bind(boundsFunc, this)));
      }

      entity.initialize();

      return entity;
    }

    function decoratedRelationship(relationship) {
      relationship.entity1 = entityByID(relationship.entity1_id)
      relationship.entity2 = entityByID(relationship.entity2_id)

      relationship.requestEndpoints = function() {
        this.entity1.requestEndpoint(this.id, this.entity2)
        this.entity2.requestEndpoint(this.id, this.entity1)
      }

      return relationship;
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
    $scope.$watch(stringifyGraph, layoutGraph);

    function stringifyGraph() {
      return JSON.stringify($scope.graph.entities) +
             JSON.stringify($scope.graph.relationships)
    }

    function layoutGraph() {
      _.each($scope.graph.relationships, function(r) {
        decoratedRelationship(r).requestEndpoints();
      })

      _.each($scope.graph.entities, function(e) {
        decoratedEntity(e).negotiateEndpoints();
      })

      calculateLinePaths();
    }

    function calculateLinePaths() {
      $scope.graph.linePaths = _.map($scope.graph.relationships, function(r) {
        r = decoratedRelationship(r);

        // TODO finish filling in linepath logic

        return "M" + r.entity1.center().x + ',' + r.entity1.center().y +
              " L" + r.entity2.center().x + ',' + r.entity2.center().y
      });
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

