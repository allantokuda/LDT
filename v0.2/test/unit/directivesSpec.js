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
    it('should make the div draggable and resizable', function() {
      inject(function($compile, $rootScope) {
        var element = $compile('<div entity></div>')($rootScope);
        expect(element).toHaveClass('ui-draggable')
        expect(element).toHaveClass('ui-resizable')
      });
    });
  });
});
