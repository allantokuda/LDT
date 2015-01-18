'use strict';

// TODO: use this service and eliminate duplicate code in editor_controller,
// once this service is functioning and tested.
// (This is a work-in-progress code move.)

// TODO: move editor_controller and GraphStore to the root LDT module after graph_controller is eliminated
angular.module('LDT.controllers').service('GraphStore', ['$q', '$http', function($q, $http) {

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
      function() {
        deferred.resolve();
      },
      function() {
        deferred.reject();
      }
    );
    return deferred.promise;
  };

}]);
