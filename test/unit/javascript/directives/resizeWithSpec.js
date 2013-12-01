'use strict';

describe('directives', function() {
  describe('resizeWith', function() {
    var element;
    var $compile, $rootScope;

    beforeEach(module('LDT.directives'));
    beforeEach(
      inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        element = $compile('<div resize-with="entity" ng-style="{ width: entity.width, height: entity.height }"></div>')($rootScope);
      })
    );

    it('should make the element resizable', function() {
      expect(element).toHaveClass('ui-resizable');
    });

    it('should bind a scope variable to the element size', function() {
      element.scope().entity = {};
      element.scope().entity.width = 150;
      element.scope().entity.height = 200;
      element.scope().$digest();
      expect(element.css('width')).toBe('150px');
      expect(element.css('height')).toBe('200px');
    });
  })
});
