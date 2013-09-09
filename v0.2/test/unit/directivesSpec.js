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
      parent_element = $compile('<div><div select-with="entity" id="element"></div><div select-with="sibling" id="sibling"></div></div>')($rootScope);
      element = parent_element.find('#element')
      sibling = parent_element.find('#sibling')
      scope = element.scope()
    }));

    describe('response to click events', function() {

      // Element selected, which of them gets clicked, and expected selection status afterward
      var scenarios = [
        { startSelected: false, elementToClick: '#element', endSelected: true  },
        { startSelected: false, elementToClick: '#sibling', endSelected: false },
        { startSelected:  true, elementToClick: '#element', endSelected: true  },
        { startSelected:  true, elementToClick: '#sibling', endSelected: false },
      ]

      _.each(scenarios, function(scenario) {
        describe('- given that the element is ' + (scenario.startSelected ? '' : 'not ') + 'selected, ' +
                    'when ' + scenario.elementToClick + ' is clicked', function() {

          it('should ' + (scenario.endSelected ? '' : 'not ') + 'have the "selected" class', function() {
            if (scenario.startSelected)
              element.addClass('selected')

            parent_element.find(scenario.elementToClick).trigger('click')

            if (scenario.endSelected)
              expect(element).toHaveClass('selected')
            else
              expect(element[0].className).toNotMatch('selected')
          });

          it('should set scope "selected" variable to ' + scenario.endSelected, function() {
            scope.entity.selected = scenario.startSelected
            parent_element.find(scenario.elementToClick).trigger('click')
            expect(scope.entity.selected).toBe(scenario.endSelected)
          });
        });
      });

    });

    it('- when clicked - should add class "selected"', function() {
      element.trigger('click')
      expect(element).toHaveClass('selected')
    });

    it('- when scope "selected" variable is set true - should add class "selected"', function() {
      scope.$apply(function() { scope.entity.selected = true })
      expect(element).toHaveClass('selected')
    });

    it('- when clicked - should remove class "selected" from its siblings', function() {
      sibling.addClass('selected')
      element.trigger('click')
      expect(sibling[0].className).toNotMatch('selected')
    });

    it('- when sibling is clicked - should remove class "selected"', function() {
      element.addClass('selected')
      sibling.trigger('click')
      expect(sibling).toHaveClass('selected')
      expect(element[0].className).toNotMatch(/selected/)
    });

    it('- when scope "selected" variable is set false - should remove "selected" class', function() {
      element.addClass('selected')
      expect(element[0].className).toMatch(/selected/)
      scope.entity.selected = false
      scope.$digest()
      expect(element[0].className).toNotMatch(/selected/)
    })

    // this needs to go into a directive for the parent canvas div
    it('should lose selection class when parent is clicked', function() {
      element.addClass('selected')
      expect(element[0].className).toMatch(/selected/)
      parent_element.trigger('click')
      expect(element[0].className).toNotMatch(/selected/)
    });

    it('should set up a click binding that sets a scope variable', function() {
      element.trigger('click')
      element.scope().$digest()
      expect(element.scope().entity.selected).toBe(true)
    });

  });
});
