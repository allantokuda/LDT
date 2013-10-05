'use strict';

describe('EntityCtrl', function(){
  var ctrl, scope;
  beforeEach(module('myApp.controllers'));
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();

    // Stub triggerUpdate method until it can be removed later
    scope.entity = { id: 123, triggerUpdate: function() { return 0; } }

    ctrl = $controller('EntityCtrl', {$scope: scope});
  }));

  it('emits a change event when the entity geometry changes', function() {
    spyOn(scope, '$emit')
    scope.$apply(function() { scope.x = scope.x + 1; });
    expect(scope.$emit).toHaveBeenCalledWith('entityGeometryChange', 123);
  });
});
