'use strict';

// source: http://docs.angularjs.org/guide/dev_guide.unit-testing

describe('directives', function() {
  describe('catchInput', function() {
    var element, parent_element;
    var $compile, $rootScope, scope;

    beforeEach(module('myApp.directives'));
    beforeEach(
      inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        parent_element = $compile(
          '<div id="parent" ng-init="x=0" ng-click="x=1">' +
            '<div id="element" catch-input>' +
            '</div>' +
          '</div>'
        )($rootScope);
        element = parent_element.find('#element')
        scope = element.scope();
      })
    );

    it('should not allow its parent to respond to click events', function() {
      element.trigger('click')
      expect(scope.x).toBe(0)
    });
  })
});
