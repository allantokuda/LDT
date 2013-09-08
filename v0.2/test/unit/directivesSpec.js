'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  beforeEach(module('myApp.directives'));

  var element;
  var $compile, $rootScope;

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  describe('moveWith', function() {
    beforeEach(inject(function(_$compile_, _$rootScope_){
      element = $compile('<div move-with="entity" ng-style="{ left: entity.x, top: entity.y }"></div>')($rootScope);
    }));

    it('should make the element draggable', function() {
      expect(element).toHaveClass('ui-draggable')
    });

    // Not sure why this test doesn't work
    xit('should bind the element position to a scope variable', function() {
      element.css('left', '60px')
      element.css('top',  '70px')
      element.scope().entity = {}
      element.trigger('drag')
      element.scope().$digest()
      expect(element.scope().entity.x).toBe(120)
      expect(element.scope().entity.y).toBe(150)
    });

    it('should bind a scope variable to the element position', function() {
      element.scope().entity = {}
      element.scope().entity.x = 120
      element.scope().entity.y = 150
      element.scope().$digest()
      expect(element.css('left')).toBe('120px')
      expect(element.css('top')).toBe('150px')
    });
  })

  describe('resizeWith', function() {
    beforeEach(inject(function(_$compile_, _$rootScope_){
      element = $compile('<div resize-with="entity" ng-style="{ width: entity.width, height: entity.height }"></div>')($rootScope);
    }));

    it('should make the element resizable', function() {
      expect(element).toHaveClass('ui-resizable')
    });

    it('should bind a scope variable to the element size', function() {
      element.scope().entity = {}
      element.scope().entity.width = 150
      element.scope().entity.height = 200
      element.scope().$digest()
      expect(element.css('width')).toBe('150px')
      expect(element.css('height')).toBe('200px')
    });
  })

  describe('selectWith', function() {
    // source: http://docs.angularjs.org/guide/dev_guide.unit-testing

    var scope, parent_element, sibling;

    beforeEach(inject(function(){
      parent_element = $compile('<div><div select-with="entity" id="element"></div><div select-with="other-entity" id="sibling" ng-class="entity.selected ? \'selected\' : \'\'"></div></div>')($rootScope);
      element = parent_element.find('#element')
      sibling = parent_element.find('#sibling')
      scope = element.scope()

    }));

    it('- when clicked - should add class "selected"', function() {
      element.trigger('click')
      expect(element).toHaveClass('selected')
    });

    it('- when clicked - should remove class "selected" from its siblings', function() {
      element.trigger('click')
      expect(sibling[0].className).toNotMatch(/selected/)
    });

    it('- when sibling is clicked - should remove class "selected"', function() {
      sibling.trigger('click')
      expect(element[0].className).toNotMatch(/selected/)
      expect(sibling[0].className).toMatch(/selected/)
    });

    it('- when scope "selected" variable is set true - should add class "selected"', function() {
      scope.$apply(function() { scope.entity.selected = true })
      expect(element).toHaveClass('selected')
    });

    xit('- when scope "selected" variable is set false - should remove "selected" class', function() {
      expect(element[0].className).toMatch(/selected/)
      scope.entity.selected = false
      scope.$digest()
      expect(element[0].className).toNotMatch(/selected/)
    })

    // this needs to go into a directive for the parent canvas div
    xit('should lose selection class when parent is clicked', function() {
      expect(element[0].className).toMatch(/selected/)
      parent_element.trigger('click')
      expect(element[0].className).toNotMatch(/selected/)
    });

    xit('should set up a click binding that sets a scope variable', function() {
      element.trigger('click')
      element.scope().$digest()
      expect(element.scope().entity.selected).toBe(true)
    });

  });
});
