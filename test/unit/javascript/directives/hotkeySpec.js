'use strict';

describe('directives', function() {
  describe('hotkey', function() {
    var element, myInput, otherInput;
    var $compile, $rootScope, scope;

    beforeEach(module('myApp.directives'));
    beforeEach(
      inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        element = $compile('<div hotkey="x">My Function</div>')($rootScope);
        scope = element.scope();
      })
    );

    //TODO Not yet testing anything
    xit('should fire a scope function named by the camel-cased contents of the element', function() {
      element.trigger('keypress', 'e');
      expect(scope.myFunction).toHaveBeenCalled()
      console.log(_.functions(expect(scope)))
    });
  })
});
