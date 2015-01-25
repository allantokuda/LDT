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
    pan: { x: 0, y: 0 }
  };

  this.load = function(graphID) {
    //Return a promise whose value is the constructed graph object.
    var deferred = $q.defer();
    $http.get('/graphs/'+graphID).then(
      function(data) {
        self.graph = {
          id: graphID,
          name: data.name,
          entities: [],
          relationships: [],
          endpoints: [],
          pan: {
            x: data.pan_x || 0,
            y: data.pan_y || 0
          }
        };

        _.each(data.entities, function(hash) {
          self.graph.entities.push(new Entity(hash));
        });

        _.each(data.relationships, function(hash) {
           var e1 = _.find(self.graph.entities, function(e){
             return e.id == hash.entity1_id;
           });
           var e2 = _.find(self.graph.entities, function(e){
             return e.id == hash.entity2_id;
           });

           var r = new Relationship(hash.id, e1, e2);

           r.endpoints[0].label  = hash.label1;
           r.endpoints[0].symbol = hash.symbol1;
           r.endpoints[1].label  = hash.label2;
           r.endpoints[1].symbol = hash.symbol2;

           self.addRelationship(r);
        });

        deferred.resolve(self.graph);
      },
      function() {
        deferred.reject();
      }
    );
    return deferred.promise;
  };

  this.addRelationship = function(r) {
    self.graph.relationships.push(r);
    self.graph.endpoints.push(r.endpoints[0]);
    self.graph.endpoints.push(r.endpoints[1]);

    r.endpoints[0].relocate();
    r.endpoints[1].relocate();
    r.endpoints[0].negotiateCoordinates();
    r.endpoints[1].negotiateCoordinates();
  };
}]);
