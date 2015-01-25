'use strict';

describe('GraphStore', function() {
  var GraphStore;
  var $timeout;
  var spiedHttpGetPath;
  var BAD_GRAPH_ID = 400123097;

  var exampleGraphData = {
    name: 'Test Graph',
    entities: [
      { id: 1, x:   3, y: 4, width: 100, height: 120, name: 'Entity 1', attributes: '' },
      { id: 2, x: 200, y: 4, width: 100, height: 120, name: 'Entity 2', attributes: '' }
    ],
    relationships: [{ entity1_id: 1, entity2_id: 2, symbol1: '', symbol2: '', label1: '', label2: '' }],
    pan_x: 250,
    pan_y: 100
  }

  beforeEach(
    module(function($provide) {
      $provide.service('$http', function($q, $timeout) {
        this.get = jasmine.createSpy('get').andCallFake(function(path) {
          spiedHttpGetPath = path;

          // Mock $http.get's promise to simulate success/failure in HTTP request
          var deferred = $q.defer();
          $timeout(function() {
            if (path == '/graphs/'+BAD_GRAPH_ID) {
              deferred.reject();
            } else {
              deferred.resolve(exampleGraphData);
            }
          });
          return deferred.promise;
        });
      });
    })
  );

  beforeEach(module('LDT.controllers'));
  beforeEach(inject(function(_GraphStore_, _$timeout_) {
    GraphStore = _GraphStore_;
    $timeout = _$timeout_;
  }));

  // This may not be a requirement later
  it('instantiates an empty graph object', function() {
    expect(GraphStore.graph.id).toEqual(0);
    expect(GraphStore.graph.name).toEqual('');
    expect(GraphStore.graph.entities).toEqual([]);
    expect(GraphStore.graph.relationships).toEqual([]);
    expect(GraphStore.graph.pan).toEqual({x: 0, y: 0});
  });

  describe('load()', function() {
    it('calls $http.get with correct graph data URL', function() {
      var graphID = 98138523;
      var promise = GraphStore.load(graphID);
      expect(spiedHttpGetPath).toBe('/graphs/' + graphID);
    });

    it('fulfills its returned promise if and when $http.get is fulfilled', function() {
      var graphID = 12345678;
      var loadPromise, loadedData;

      loadPromise = GraphStore.load(graphID);

      // Set success handler (1st argument to then())
      loadPromise.then(function(data) {
        loadedData = data;
      });

      // End the earlier defined $timeout to fulfill the promise
      // http://stackoverflow.com/questions/20311118/angular-promise-not-resolving-in-jasmine/20311552#20311552
      // http://stackoverflow.com/questions/23131838/testing-angularjs-promises-in-jasmine-2-0
      $timeout.flush();

      expect(loadedData).toBeDefined();
    });

    it('rejects its returned promise if and when $http.get is rejected', function() {
      var loadPromise, errored;

      loadPromise = GraphStore.load(BAD_GRAPH_ID);
      errored = false;

      // Set failure handler (2nd argument to then())
      loadPromise.then(null, function(stuff) {
        errored = true;
      });

      $timeout.flush();

      expect(errored).toBe(true);
    });

    it('transforms the data into an in-memory structure', function() {
      var loadedData;
      var graphID = 35902341;
      GraphStore.load(graphID).then(function(data) { loadedData = data; });
      $timeout.flush();

      expect(loadedData.id).toEqual(graphID);
      expect(loadedData.pan.x).toEqual(exampleGraphData.pan_x);
      expect(loadedData.pan.y).toEqual(exampleGraphData.pan_y);
      expect(loadedData.name).toEqual(exampleGraphData.name);

      // In the future the graph store should not be responsible for graph construction,
      // and the items below should not need to be tested here.

      expect(loadedData.entities[0].x).toEqual(exampleGraphData.entities[0].x);
      expect(loadedData.relationships[0].endpoints[0].entity.id).toEqual(exampleGraphData.relationships[0].entity1_id);

      expect(loadedData.endpoints[0].x).toEqual(103);
      expect(loadedData.endpoints[0].y).toEqual(64);
    });

    it('supplies default pan values of 0,0', function() {
      var loadedData;
      exampleGraphData.pan_x = undefined;
      exampleGraphData.pan_y = undefined;
      GraphStore.load(128310234).then(function(data) { loadedData = data; });
      $timeout.flush();

      expect(loadedData.pan.x).toEqual(0);
      expect(loadedData.pan.y).toEqual(0);
    });
  });
});
