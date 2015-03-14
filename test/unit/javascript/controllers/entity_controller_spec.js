'use strict';

describe('EntityCtrl', function(){
  var ctrl, scope;
  beforeEach(module('LDT.controllers'));
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    scope.entity = { id: 123, x: 100, notifyChange: function() {} }
    ctrl = $controller('EntityCtrl', {$scope: scope});
  }));

  it('runs the entity change notifier when it detects an entity change', function() {
    spyOn(scope.entity, 'notifyChange')
    scope.$apply(function() { scope.entity.x = scope.entity.x + 1; });
    expect(scope.entity.notifyChange).toHaveBeenCalled();
  });
});
