'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  describe('selectWith', function() {
    var element;
    var $compile, $rootScope;
    var scope, parent_element, sibling;

    beforeEach(module('myApp.directives'));
    beforeEach(inject(function(_$compile_, _$rootScope_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;

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
        describe('- given the element is ' + (scenario.startSelected ? '' : 'not ') + 'selected, ' +
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

    describe('response to scope changes', function() {

      describe('given the element is NOT selected', function() {
        it('- when scope "selected" variable is set true - should add class "selected"', function() {
          scope.$apply(function() { scope.entity.selected = true });
          expect(element).toHaveClass('selected')
        });
      });

      describe('given the element IS selected', function() {
        beforeEach(inject(function() { element.addClass('selected') }));

        it('- when scope "selected" variable is set false - should remove class "selected"', function() {
          scope.$apply(function() { scope.entity.selected = false });
          expect(element[0].className).toNotMatch('selected')
        });
      });
    });

    it('should lose selection class when parent is clicked', function() {
      element.addClass('selected')
      expect(element[0].className).toMatch(/selected/)
      parent_element.trigger('click')
      expect(element[0].className).toNotMatch(/selected/)
    });

  });
});
