'use strict';

// source: http://docs.angularjs.org/guide/dev_guide.unit-testing

describe('directives', function() {
  describe('autoFocus', function() {
    var element, myInput, otherInput;
    var $compile, $rootScope, scope;

    beforeEach(module('LDT.directives'));
    beforeEach(
      inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        element = $compile(
          '<div autoFocus="#myInput on dblclick">' +
            '<input id="myInput">' +
            '<input id="otherInput">' +
          '</div>'
        )($rootScope);
        myInput    = element.find('#myInput')
        otherInput = element.find('#otherInput')
        scope = element.scope();
      })
    );

    // This test is not working. Click triggering does not actually cause focus/selection change.
    it('should fully select an input element when triggered', function() {
      otherInput.focus()
      otherInput.select()
      element.trigger('dblclick')
      expect(myInput).toBeFocused
      expect(myInput).toBeSelected
    });
  })
});
