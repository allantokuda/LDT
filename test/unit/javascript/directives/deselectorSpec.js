'use strict';

describe('deselector', function() {
  var element, $compile, $rootScope, scope;

  beforeEach(module('LDT.ui'));
  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    element = $compile('<div deselector></div>')($rootScope);
    scope = element.scope();
  }));

  it('should broadcast a "deselect_all" event when clicked', function() {
    spyOn(scope, '$broadcast');
    element.trigger('click');
    expect(scope.$broadcast).toHaveBeenCalledWith('deselectAll');
  });
});
