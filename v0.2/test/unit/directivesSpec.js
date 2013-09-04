'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  beforeEach(module('myApp.directives'));

  describe('app-version', function() {
    it('should print current version', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VERSION');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VERSION');
      });
    });
  });

  describe('entity', function() {
    // source: http://docs.angularjs.org/guide/dev_guide.unit-testing
    var $compile;
    var $rootScope;
    beforeEach(inject(function(_$compile_, _$rootScope_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should make the div draggable and resizable', function() {
      var element = $compile('<div entity></div>')($rootScope);
      expect(element).toHaveClass('ui-draggable')
      expect(element).toHaveClass('ui-resizable')
    });

    it('should bind the element position to the scope variable', function() {
      var element = $compile('<div entity style="position: absolute" ng-style="{ top: entity.y + \'px\', left: entity.x + \'px\' }"></div>')($rootScope);
      element.scope().entity = { x: '120', y: '90' }
      element.scope().$digest()
      expect(element.css('left')).toBe('120px')
      expect(element.css('top')).toBe('90px')
    })
  });
});
