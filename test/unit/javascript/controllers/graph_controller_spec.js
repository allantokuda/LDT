'use strict';
/*

describe('GraphCtrl', function() {
  var ctrl, scope, childScope, paths, r, e1, e2, e3, ep1, ep2, GraphStore;
  beforeEach(module('LDT.controllers'));
  beforeEach(inject(function ($rootScope, $controller, _GraphStore_) {
    scope = $rootScope.$new();
    ctrl = $controller('GraphCtrl', {$scope: scope});
    childScope = scope.$new();
    GraphStore = _GraphStore_;

    e1 = new Entity({id: 0, x:   0, y:   0, width: 100, height: 120, name: 'thing',  attributes: 'size\nshape'});
    e2 = new Entity({id: 1, x: 200, y:   0, width: 100, height: 120, name: 'gadget', attributes: 'shape'});
    e3 = new Entity({id: 2, x:   0, y: 200, width: 100, height: 120, name: 'doodad', attributes: ''});

    r = new Relationship(0,e1,e2);

    ep1 = r.endpoints[0];
    ep2 = r.endpoints[1];

    ep1.relocate();
    ep2.relocate();
    ep1.negotiateCoordinates();
    ep2.negotiateCoordinates();

    GraphStore.graph.relationships = [r];
    GraphStore.graph.entities = [e1, e2, e3];
    GraphStore.graph.endpoints = [ep1, ep2];
  }));

});
*/
