'use strict';

describe('EntityCtrl', function(){
  var ctrl, scope;
  beforeEach(module('LDT.controllers'));
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    scope.entity = { id: 123, x: 100, notifyChange: function() {} }
    ctrl = $controller('EntityCtrl', {$scope: scope});
  }));

  it('emits a change event when the entity geometry changes', function() {
    spyOn(scope, '$emit')
    scope.$apply(function() { scope.entity.x = scope.entity.x + 1; });
    expect(scope.$emit).toHaveBeenCalledWith('entityGeometryChange', 123);
  });
});
