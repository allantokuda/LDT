'use strict';

// source: http://docs.angularjs.org/guide/dev_guide.unit-testing

describe('directives', function() {
  describe('moveWith', function() {
    var element;
    var $compile, $rootScope;

    beforeEach(module('LDT.directives'));
    beforeEach(
      inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        element = $compile('<div move-with="entity" ng-style="{ left: entity.x, top: entity.y }"></div>')($rootScope);
      })
    );

    it('should make the element draggable', function() {
      expect(element).toHaveClass('ui-draggable');
    });

    it('should bind a scope variable to the element size', function() {
      element.scope().entity = {};
      element.scope().entity.x = 150;
      element.scope().entity.y = 200;
      element.scope().$digest();
      expect(element.css('left')).toBe('150px')
      expect(element.css('top')).toBe('200px')
    });
  })
});
