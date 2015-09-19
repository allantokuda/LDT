'use strict';

// TODO: use this service and eliminate duplicate code in editor_controller,
// once this service is functioning and tested.
// (This is a work-in-progress code move.)

// TODO: move editor_controller and GraphStore to the root LDT module after graph_controller is eliminated
angular.module('LDT.controllers').service('GraphStore', ['$q', '$http', function($q, $http) {

  var self = this;

  // empty graph prior to load.
  this.graph = {
    id: 0,
    name: '',
    entities: [],
    relationships: [],
    endpoints: [],
    paths: {},
    pan: { x: 0, y: 0 },
    zoom: 1
  };

  this.next_entity_id = 0;
  this.next_relationship_id = 0;

  this.load = function(graphID) {
    //Return a promise whose value is the constructed graph object.
    var deferred = $q.defer();
    $http.get('/graphs/'+graphID).then(
      function(response) {
        self.graph.id = graphID;
        self.graph.name = response.data.name;
        self.graph.entities = [];
        self.graph.relationships = [];
        self.graph.endpoints = [];
        self.graph.paths = {};
        self.graph.pan.x = response.data.pan_x || 0;
        self.graph.pan.y = response.data.pan_y || 0;
        self.graph.zoom = response.data.zoom || 1;

        _.each(response.data.entities, function(hash) {
          self.graph.entities.push(new window.Entity(hash));
        });

        _.each(response.data.relationships, function(hash) {
          var e1 = _.find(self.graph.entities, function(e){
            return e.id == hash.entity1_id;
          });
          var e2 = _.find(self.graph.entities, function(e){
            return e.id == hash.entity2_id;
          });

          var r = new window.Relationship(hash.id, e1, e2);

          r.endpoints[0].label  = hash.label1;
          r.endpoints[0].symbol = hash.symbol1;
          r.endpoints[1].label  = hash.label2;
          r.endpoints[1].symbol = hash.symbol2;

          self.addRelationship(e1, e2, r);
        });

        self.next_entity_id       = self.nextID(self.graph.entities);
        self.next_relationship_id = self.nextID(self.graph.relationships);

        deferred.resolve(self.graph);
      },
      function() {
        deferred.reject();
      }
    );
    return deferred.promise;
  };

  this.save = function() {
    var deferred = $q.defer();

    var graphData = {
      id    : self.graph.id,
      name  : self.graph.name,
      pan_x : self.graph.pan.x,
      pan_y : self.graph.pan.y,
      zoom  : self.graph.zoom
    };
    graphData.entities      = _.map(self.graph.entities,      function(e) { return e.saveObject(); });
    graphData.relationships = _.map(self.graph.relationships, function(r) { return r.saveObject(); });

    var encodeData = JSON.stringify(graphData);

    $http.put('/graphs/'+graphData.id, encodeData).then(
      function() { deferred.resolve(); },
      function() { deferred.reject(); }
    );

    return deferred.promise;
  };

  this.createRelationship = function(entity1, entity2) {
    var id = self.next_relationship_id++;
    var r = new window.Relationship(id, entity1, entity2);
    self.addRelationship(entity1, entity2, r);
    return r;
  };

  this.addRelationship = function(e1, e2, r) {
    self.appendToPath(e1, e2, r);
    self.graph.relationships.push(r);
    self.graph.endpoints.push(r.endpoints[0]);
    self.graph.endpoints.push(r.endpoints[1]);
    e1.attachRelationship(r);
    e2.attachRelationship(r);
  };

  this.createEntity = function(locX,locY) {
    self.graph.entities.push(new window.Entity({
      id: self.next_entity_id++,
      x: locX,
      y: locY,
      width: 120,
      height: 150,
      name: "New Entity",
      attributes: ""
    }));
  };

  this.nextID = function(set) {
    if (typeof(set) == 'undefined' || set.length === 0)
      return 0;
    else
      return _.max(set, function(item) { return item.id; }).id + 1;
  };

  this.deleteEntity = function(entity_to_delete) {

    // Remove all connected relationships and their endpoints
    _.each(self.graph.relationships, function(r) {
      if (r.entity1_id == entity_to_delete.id || r.entity2_id == entity_to_delete.id) {

        self.graph.endpoints = _.reject(self.graph.endpoints, function(endpoint) {
          return endpoint == r.endpoints[0] || endpoint == r.endpoints[1];
        });

        self.graph.relationships = _.reject(self.graph.relationships, function(relationship) {
          return relationship == r;
        });
      }
    });

    // Remove entity
    self.graph.entities = _.reject(self.graph.entities, function(e) {
      return e == entity_to_delete;
    });
  };

  this.deleteRelationship = function(relationship_to_delete) {
    var endpoints = relationship_to_delete.endpoints;

    _.each(endpoints, function(endpoint_to_delete) {
      // Remove all connected endpoints from graph
      self.graph.endpoints = _.without(self.graph.endpoints, endpoint_to_delete);
    });

    // Remove relationship
    self.graph.relationships = _.without(self.graph.relationships, relationship_to_delete);

    // Remove Path if empty
    var key;
    var e1_id = relationship_to_delete.entity1_id;
    var e2_id = relationship_to_delete.entity2_id;
    if (e1_id < e2_id) {
      key = e1_id + '-' + e2_id;
    } else {
      key = e2_id + '-' + e1_id;
    }
    this.graph.paths[key].removeRelationship(relationship_to_delete);
    if (this.graph.paths[key].relationships.length === 0) {
      delete this.graph.paths[key];
    }
  };

  this.deselectAll = function() {
    _.each(self.graph.entities, function(entity) {
      entity.selected = false;
    });
  };

  this.appendToPath = function(e1, e2, r) {
    var key;

    if (e1.id < e2.id) {
      key = e1.id + '-' + e2.id;
    } else {
      key = e2.id + '-' + e1.id;
    }

    if (this.graph.paths[key] === undefined) {
      this.graph.paths[key] = new window.Path(e1, e2);
    }

    this.graph.paths[key].addRelationship(r);

    this.graph.paths[key].update();
  };

  this.getEntity = function(entityId) {
    return _.find(this.graph.entities, function(e) {
      return e.id === entityId;
    });
  };

  this.getAllRelationships = function() {
    return this.graph.relationships;
  };
}]);
