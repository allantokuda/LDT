'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  beforeEach(module('myApp.directives'));

  describe('entity', function() {
    // source: http://docs.angularjs.org/guide/dev_guide.unit-testing
    var element;
    var $compile;
    var $rootScope;

    beforeEach(inject(function(_$compile_, _$rootScope_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      element = $compile('<div entity></div>')($rootScope);
    }));

    it('should make the div draggable and resizable', function() {
      expect(element).toHaveClass('ui-draggable')
      expect(element).toHaveClass('ui-resizable')
    });

    it('should bind the element position to the scope variable', function() {
      element = $compile('<div entity ng-style="{ top: entity.y + \'px\', left: entity.x + \'px\' }"></div>')($rootScope);
      element.scope().entity = { x: 120, y: 90 }
      element.scope().$digest()
      expect(element.css('left')).toBe('120px')
      expect(element.css('top')).toBe('90px')
    })

    it('should bind the element size to the scope variable', function() {
      element = $compile('<div entity ng-style="{ width: entity.width + \'px\', height: entity.height + \'px\' }"></div>')($rootScope);
      element.scope().entity = { width: 110, height: 80 }
      element.scope().$digest()
      expect(element.css('width')).toBe('110px')
      expect(element.css('height')).toBe('80px')
    });

    describe('selection binding', function() {
      beforeEach(inject(function(){
        element = $compile('<div entity></div>')($rootScope);
        element.trigger('click')
      }));

      it('should set a selection class', function() {
        expect(element).toHaveClass('selected')
      });

      it('should remove selection class from all others of its type', function() {
        var parent_element = $compile('<div id="canvas"><div entity id="test"></div><div entity id="sibling"></div></div>')($rootScope);
        parent_element.find('#sibling').trigger('click')
        parent_element.find('#test').trigger('click')
        expect(parent_element.find('#test'   )[0].className).toMatch(/selected/)
        expect(parent_element.find('#sibling')[0].className).toNotMatch(/selected/)
      });

      // this needs to go into a directive for the parent canvas div
      it('should lose selection class when parent is clicked', function() {
        var parent_element = $compile('<div id="canvas"><div entity id="test"></div></div>')($rootScope);
        var test = parent_element.find('#test')
        test.trigger('click')
        expect(test[0].className).toMatch(/selected/)
        $(parent_element).trigger('click')
        expect(test[0].className).toNotMatch(/selected/)
      });

      xit('should set up a click binding that sets a scope variable', function() {
        element.trigger('click')
        element.scope().$digest()
        expect(element.scope().entity.selected).toBe(true)
      });
    })

  });
});
