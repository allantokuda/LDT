'use strict';

angular.module('myApp.controllers').controller('GraphCtrl', function($scope) {

    var ARROWHEAD_LENGTH = 30
    var ARROWHEAD_WIDTH = 20
    var SIDES = ['top', 'bottom', 'left', 'right'];

    var ARROWHEAD = {
      box: [['M',0,1.5],['L',4,1.5],['L',4,-1.5],['L',0,-1.5],['L',0,1.5]],
      none: [['M',0,0]],
      '?': [['M',0.7,-0.3], ['L',0.7,-0.7], ['L',1.1,-0.7], ['L',1.1,-0.5], ['L',1.3,-0.5], ['M',1.5,-0.5], ['L',1.7,-0.5]],
      chickenfoot: [['M',0,1], ['L',2,0], ['L',0,-1]],
      identifier:  [['M',1.5,1], ['L',1.5,-1]],
      chickenfoot_identifier:  [['M',0,1], ['L',2,0], ['L',0,-1], ['M',2.5,1], ['L',2.5,-1]]
    };

    // Allow tests to pass on this scope alone, though this scope will actually
    // inherit the definition so that the parent scope can use it.
    if (typeof($scope.graph) == 'undefined')
      $scope.graph = new Object;

    $scope.graph.initialize = function() {

      if (typeof($scope.graph.name) == 'undefined') {
        $scope.graph.name = "Untitled graph"
        $scope.graph.entities = []
        $scope.graph.relationships = []
      }

      $scope.graph.next_entity_id = _.max($scope.graph.entities, function(e) { return e.id }) + 1;
      if ($scope.graph.next_entity_id == -Infinity)
        $scope.graph.next_entity_id = 1

      $scope.graph.next_relationship_id = _.max($scope.graph.entities, function(e) { return e.id }) + 1;
      if ($scope.graph.next_relationship_id == -Infinity)
        $scope.graph.next_relationship_id = 1

      $scope.graph.changeToggler = false
    }

    // Expensive watch operation here, but it seems to work well for this application.
    // http://stackoverflow.com/questions/14712089/how-to-deep-watch-an-array-in-angularjs
    $scope.$watch(stringifyGraph, layoutGraph);

    function stringifyGraph() {
      return $scope.graph.name +
             JSON.stringify($scope.graph.entities) +
             JSON.stringify($scope.graph.relationships)
    }

    function layoutGraph() {
      // Let editor watch for changes
      $scope.graph.changeToggler = !$scope.graph.changeToggler;

      // Recreate decorated entities
      $scope.graph.decoratedEntities      = _.map($scope.graph.entities,      decorateEntity);
      $scope.graph.decoratedRelationships = _.map($scope.graph.relationships, decorateRelationship);

      // Each relationship requests an endpoint from each of its entities.
      // Only need decorated relationship momentarily, so don't bother storing it in the scope
      _.each($scope.graph.decoratedRelationships, function(r) {
        r.requestEndpoints();
      })

      // Each entity negotiates its relationships' requests
      // to choose actual attachment points
      _.each($scope.graph.decoratedEntities, function(e) {
        e.negotiateEndpointsOnEachSide();
      })

      setupArrowheads();

      setupLabels();
    }

    function decorateEntity(e) {
      // Clone the object so the scope watch only needs to watch the base data
      var entity = $.extend({}, e);

      entity.coordinates = function(xloc,yloc) {
        return {
          x: Math.round(this.x + this.width  * xloc),
          y: Math.round(this.y + this.height * yloc)
        }
      }
      entity.center = function() {
        return this.coordinates(0.5,0.5)
      }

      entity.nearestSide = function(other) {
        // Distance expressions are positive when the entities are separated,
        // and negative when the entities overlap.
        var outward_distances = [
          { name: 'left',   dist: this.x - other.x - other.width  },
          { name: 'top',    dist: this.y - other.y - other.height },
          { name: 'right',  dist: other.x - this.x - this.width  },
          { name: 'bottom', dist: other.y - this.y - this.height }
        ]
        return _.reduce(outward_distances, function(nearest, side) {
          //Counterintuitive, but the "nearest" side actually has the GREATEST
          //outward distance to the other entity's opposing side.
          if (nearest == null || side.dist > nearest.dist)
            return side
          else
            return nearest
        }, null).name;
      }

      entity.along = function(side, point) {
        if (side == 'top' || side == 'bottom')
          return point.x
        else
          return point.y
      }

      entity.sideCenterOffsetCoordinates = function(side, centerOffset) {
        var xCoord = this.x + this.width  / 2 + centerOffset
        var yCoord = this.y + this.height / 2 + centerOffset

        switch(side) {
          case 'top':    return { x: xCoord, y: this.y }; break;
          case 'bottom': return { x: xCoord, y: this.y + this.height }; break;
          case 'left':   return { y: yCoord, x: this.x }; break;
          case 'right':  return { y: yCoord, x: this.x + this.width  }; break;
        }
      }

      // Think of widths and heights abstractly as "spans"
      entity.span = function(side) {
        if (side == 'top' || side == 'bottom')
          return this.width
        else
          return this.height
      }

      entity.default_endpoint_bounds = function(side) {
        var offset;
        if (side == 'top' || side == 'bottom')
          offset = Math.round((this.width  - ARROWHEAD_WIDTH) / 2);
        else
          offset = Math.round((this.height - ARROWHEAD_WIDTH) / 2);

        return {min: -offset, max: offset}
      }

      // To be called by each relationship, to get a list of needing relationships
      entity.requestEndpoint = function(relationship_id, other_entity) {
        var side = this.nearestSide(other_entity);
        var center_to_center = this.along(side, other_entity.center()) -
                               this.along(side, this.center());

        var max_straight_line_offset = (this.span(side) + other_entity.span(side)) / 2 - ARROWHEAD_WIDTH
        var ideal_offset = Math.round((this.span(side) - ARROWHEAD_WIDTH) / 2 *
                           center_to_center / max_straight_line_offset)

        var outward_vector;
        switch(side) {
          case 'top':    outward_vector = {x: 0, y:-1}; break;
          case 'bottom': outward_vector = {x: 0, y: 1}; break;
          case 'left':   outward_vector = {x:-1, y: 0}; break;
          case 'right':  outward_vector = {x: 1, y: 0}; break;
        }

        var endpoint = {
          relationship_id: relationship_id,
          side:            side,
          ideal_offset:    ideal_offset,
          outward_vector:  outward_vector
        }
        //Store endpoint in entity and also return it for reference by the relationship
        this.endpoints[side].push(endpoint);
        return endpoint;
      }

      entity.negotiateEndpointsOnEachSide = function() {
        var callFunc = function(side) { this.negotiateEndpoints(side) }
        _.each(SIDES, _.bind(callFunc, this))
      }

      // To be called once per draw, AFTER all relationships have made an endpoint request
      entity.negotiateEndpoints = function(side) {
        // Give priority to endpoints that want the greatest offset from center
        this.endpoints[side] = _.sortBy(this.endpoints[side], function(endpoint) {
          return -Math.abs(endpoint.ideal_offset)
        });

        // Place each endpoint in the above priority
        _.each(this.endpoints[side], _.bind(function(endpoint) {

          // Ideal offset falls naturally in the allowed area -> let it be exactly there
          if(endpoint.ideal_offset > this.endpoint_bounds[side].min &&
             endpoint.ideal_offset < this.endpoint_bounds[side].max) {
            endpoint.assigned_offset = endpoint.ideal_offset;

          // Ideal offset is below the allowed area
          } else if (endpoint.ideal_offset <= this.endpoint_bounds[side].min) {
            endpoint.assigned_offset = this.endpoint_bounds[side].min

          // Ideal offset is above the allowed area
          } else if (endpoint.ideal_offset >= this.endpoint_bounds[side].max) {
            endpoint.assigned_offset = this.endpoint_bounds[side].max
          }

          // Assign global coordinates for use by relationsihp draw
          var coordinates = this.sideCenterOffsetCoordinates(side, endpoint.assigned_offset);
          endpoint.x = coordinates.x
          endpoint.y = coordinates.y

          // Finally close up the allowed area for the next relationship.
          // Connection point is above center so bring down the max
          if (endpoint.ideal_offset > 0)
            this.endpoint_bounds[side].max = endpoint.assigned_offset - ARROWHEAD_WIDTH
          // Connection point is below center so bring up the min
          else
            this.endpoint_bounds[side].min = endpoint.assigned_offset + ARROWHEAD_WIDTH
        },this));
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

    function decorateRelationship(r) {
      // Clone the object so the scope watch only needs to watch the base data
      var relationship = $.extend({}, r);

      relationship.entity1 = decoratedEntityByID(relationship.entity1_id);
      relationship.entity2 = decoratedEntityByID(relationship.entity2_id);

      relationship.requestEndpoints = function() {
        this.endpoint1 = this.entity1.requestEndpoint(this.id, this.entity2);
        this.endpoint2 = this.entity2.requestEndpoint(this.id, this.entity1);
        this.endpoint1.label = this.label1;
        this.endpoint2.label = this.label2;
        this.endpoints = [this.endpoint1, this.endpoint2]
      }

      relationship.svgPath = function() {

        var arrowTip = []
        arrowTip[0] = this.endpoint1;
        arrowTip[1] = this.endpoint2;

        var arrowBase = _.map(arrowTip, function(tip) {
          return {
            x: (tip.x + tip.outward_vector.x * ARROWHEAD_LENGTH),
            y: (tip.y + tip.outward_vector.y * ARROWHEAD_LENGTH)
          }
        });

        return svgPolyline([arrowTip[0], arrowBase[0], arrowBase[1], arrowTip[1]]);
      }

      return relationship;
    }

    function svgPolyline(points) {
      if (points.length >= 2)
        return "M" + _.map(points, function(point) {
          return point.x + ',' + point.y
        }).join(' L');
    }

    function decoratedEntityByID(id) {
      return _.find($scope.graph.decoratedEntities, function(e) {
        return e.id == id
      });
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

    function setupLabels() {
      $scope.graph.labels = [];
      _.each($scope.graph.decoratedRelationships, function(r) {
        _.each(r.endpoints, function(endpoint) {
          var offset, direction;
          switch(endpoint.side) {
            case 'top':    offset = { x:   5, y: -50 }; direction = 'left';  break;
            case 'bottom': offset = { x:   5, y:  30 }; direction = 'left';  break;
            case 'left':   offset = { x: -32, y:   2 }; direction = 'right'; break;
            case 'right':  offset = { x:  32, y: -20 }; direction = 'left';  break;
          }
          $scope.graph.labels.push({
            text: endpoint.label,
            x: endpoint.x + offset.x,
            y: endpoint.y + offset.y,
            direction: direction
          });
        });
      });
    }

    function decorateEndpoint(endpoint, symbol, relationship_ending) {
      endpoint.relationship_ending = relationship_ending
      endpoint.symbol = symbol
      endpoint.path = renderArrowhead(endpoint.symbol, endpoint.side, endpoint.x, endpoint.y)
      endpoint.box  = renderArrowhead('box',           endpoint.side, endpoint.x, endpoint.y)
    }

    function renderArrowhead(symbol, side, x, y) {
      // Convert array of arrays into array of objects
      var arrowhead = _.map(ARROWHEAD[symbol], pointObject)

      // Translate and rotate the arrowhead into place (point by point)
      _.each(arrowhead, function(pathSegment) {
        scaleTranslateAndRotate(pathSegment, side, x, y);
      });

      // Render the arrowhead by calling render on each of its points, and joining resulting strings
      var svg = _.map(arrowhead, function(point) { return point.render(); } ).join(' ')

      return svg;
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

    function pointObject(data_array) {
      var point_object = _.object(['command', 'x', 'y'], data_array);
      point_object.render = function() {
        return this.command + this.x + ',' + this.y;
      }
      return point_object;
    }

    function scaleTranslateAndRotate(point, side, baseX, baseY) {
      var newX, newY, scale;
      scale = Math.round(ARROWHEAD_WIDTH / 2);
      switch(side) {
        case 'right':  newX = baseX + scale * point.x; newY = baseY + scale * point.y; break;
        case 'left':   newX = baseX - scale * point.x; newY = baseY - scale * point.y; break;
        case 'top':    newX = baseX + scale * point.y; newY = baseY - scale * point.x; break;
        case 'bottom': newX = baseX - scale * point.y; newY = baseY + scale * point.x; break;
      }
      point.x = newX;
      point.y = newY;
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

