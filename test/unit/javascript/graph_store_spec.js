'use strict';

describe('GraphStore', function() {
  var GraphStore;
  var $timeout;
  var spiedHttpGetPath;
  var spiedHttpPutPath;
  var spiedHttpPutData;
  var BAD_GRAPH_ID = 400123097;

  var exampleGraphData = {
    name: 'Test Graph',
    entities: [
      { id: 0, x:   0, y:   0, width: 100, height: 120, name: 'thing',  attributes: 'size\nshape'},
      { id: 1, x: 200, y:   0, width: 100, height: 120, name: 'gadget', attributes: 'shape'},
      { id: 2, x:   0, y: 200, width: 100, height: 120, name: 'doodad', attributes: ''}
    ],
    relationships: [{ id: 7, entity1_id: 0, entity2_id: 1, symbol1: '', symbol2: '', label1: '', label2: '' }],
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
              deferred.resolve({ data: exampleGraphData });
            }
          });
          return deferred.promise;
        });

        this.put = jasmine.createSpy('put').andCallFake(function(path, data) {
          spiedHttpPutPath = path;
          spiedHttpPutData = JSON.parse(data);

          // Mock $http.put's promise to simulate success/failure in HTTP request
          var deferred = $q.defer();
          $timeout(function() {
            if (path == '/graphs/'+BAD_GRAPH_ID) {
              deferred.reject();
            } else {
              deferred.resolve();
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

      expect(loadedData.endpoints[0].x).toEqual(100);
      expect(loadedData.endpoints[0].y).toEqual(60);
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

  describe('save()', function() {
    it('calls $http.put with correct graph data URL', function() {
      GraphStore.createEntity(7,12);
      var promise = GraphStore.save();
      expect(spiedHttpPutPath).toBe('/graphs/' + GraphStore.graph.id);
      expect(spiedHttpPutData.entities[0].x).toBe(7);
      expect(spiedHttpPutData.entities[0].y).toBe(12);
    });
  });

  describe('next entity ID number', function() {
    it('should be largest entity ID + 1', function() {
      GraphStore.load(812311120); $timeout.flush();
      expect(GraphStore.next_entity_id).toEqual(3);
    });

    it('should be 0 when there are no entities', function() {
      GraphStore.graph.entities = [];
      expect(GraphStore.next_entity_id).toEqual(0);
    });

    it('should be 0 when the entity set has not been defined', function() {
      GraphStore.graph.entities = undefined;
      expect(GraphStore.next_entity_id).toEqual(0);
    });
  });

  describe('deletion of entity', function() {
    var e1;
    beforeEach(inject(function() {
      GraphStore.load(71237123); $timeout.flush();
      e1 = GraphStore.graph.entities[0];
      GraphStore.deleteEntity(e1);
    }));

    it('should delete the entity from the graph', function() {
      expect(GraphStore.graph.entities.length).toBe(2);
    });

    it('should delete all connected relationships', function() {
      expect(GraphStore.graph.relationships.length).toBe(0);
    });

    it('should delete endpoints from associated entities', function() {
      expect(e1.endpoints['right'].length).toBe(0);
    });
  });

  describe('deletion of relationship', function() {
    beforeEach(inject(function() {
      GraphStore.load(27152132); $timeout.flush();
      GraphStore.deleteRelationship(GraphStore.graph.relationships[0]);
    }));

    it('should delete the relationship from the graph', function() {
      expect(GraphStore.graph.relationships.length).toBe(0);
    });

    it('should delete the associated endpoints from the graph', function() {
      expect(GraphStore.graph.endpoints.length).toBe(0);
    });
  });

  describe('#createRelationship', function() {
    var r2;

    beforeEach(inject(function() {
      GraphStore.load(27152132); $timeout.flush();
      var e1 = GraphStore.graph.entities[0];
      var e2 = GraphStore.graph.entities[1];
      r2 = GraphStore.createRelationship(e1, e2);
    }));

    it('should create a relationship', function() {
      expect(r2).toBeDefined();
    });

    it('should add the relationship to the graph', function() {
      expect(_.last(GraphStore.graph.relationships.$id)).toBe(r2.$id);
    });

    it('should add the endpoints to the graph', function() {
      expect(_.last(GraphStore.graph.endpoints).$id).toBe(r2.endpoints[1].$id);
    });
  });

  it('should set all entities deselected when deselect() is called', function() {
    GraphStore.load(27152132); $timeout.flush();
    GraphStore.graph.entities[0].selected = true;
    GraphStore.deselectAll();
    expect(GraphStore.graph.entities[0].selected).toBe(false);
    expect(GraphStore.graph.entities[1].selected).toBe(false);
    expect(GraphStore.graph.entities[2].selected).toBe(false);
  });

  it('groups relationships into paths', function() {
    var e1 = { id: 1 };
    var e2 = { id: 2 };
    var e3 = { id: 3 };

    var r1 = { pathKey: '1-2', place: function() {} };
    var r2 = { pathKey: '1-2', place: function() {} };
    var r3 = { pathKey: '2-3', place: function() {} };

    GraphStore.appendToPath(e1, e2, r1);
    GraphStore.appendToPath(e1, e2, r2);
    GraphStore.appendToPath(e2, e3, r3);

    expect(_.keys(GraphStore.graph.paths)).toEqual(['1-2', '2-3']);
    expect(GraphStore.graph.paths['1-2'].relationships.length).toBe(2);
    expect(GraphStore.graph.paths['2-3'].relationships.length).toBe(1);
  });
});
