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

      //TODO: define the class to apply in the directive, as well as the class on all siblings.
      parent_element = $compile('<div><div select-with="click as entity" id="element"></div><div select-with="click as sibling" id="sibling"></div></div>')($rootScope);
      element = parent_element.find('#element')
      sibling = parent_element.find('#sibling')
      scope = element.scope()
    }));

    it('accepts an object string with event and scope variable name', function() {
      expect(scope.entity.selected).toBeDefined();
    });

    it('triggers on arbitrary javascript events', function() {
      element = $compile('<div select-with="dblclick as doubleClicker"></div>')($rootScope);
      element.trigger('dblclick');
      expect(element).toHaveClass('selected');
    });

    describe('response to click events', function() {

      // Element selected, which of them gets clicked, and expected selection status afterward
      var scenarios = [
        { startSelected: false, target: '#element', endSelected: true  },
        { startSelected: false, target: '#sibling', endSelected: false },
        { startSelected:  true, target: '#element', endSelected: true  },
        { startSelected:  true, target: '#sibling', endSelected: false },
      ]

      _.each(scenarios, function(scenario) {
        describe('- given the element is ' + (scenario.startSelected ? '' : 'not ') + 'selected, ' +
                    'when ' + scenario.target + ' is clicked', function() {

          it('should ' + (scenario.endSelected ? '' : 'not ') + 'have the "selected" class', function() {
            if (scenario.startSelected)
              element.addClass('selected')

            parent_element.find(scenario.target).trigger('click')

            if (scenario.endSelected)
              expect(element).toHaveClass('selected')
            else
              expect(element[0].className).toNotMatch('selected')
          });

          it('should set scope "selected" variable to ' + scenario.endSelected, function() {
            scope.entity.selected = scenario.startSelected
            parent_element.find(scenario.target).trigger('click')
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

    it('becomes deselected when parent is clicked', function() {
      element.addClass('selected')
      parent_element.trigger('click')
      expect(element[0].className).toNotMatch(/selected/)
    });

    describe('when a grandparent deselector is defined', function() {
      var testDOM, greatgrandparent_element, grandparent_element, cousin_element;

      beforeEach(inject(function() {
        testDOM = $compile(
          '<div id="greatgrandparent">' +
            '<div id="grandparent">' +
              '<div id="parent">' +
                '<div id="element" select-with="click as entity in #grandparent"></div>' +
              '</div>' +
              '<div id="uncle">' +
                '<div id="cousin" select=with="click as cousin in #grandparent"></div>' +
              '</div>' +
            '</div>' +
          '</div>'
        )($rootScope);

        greatgrandparent_element = testDOM.find('#greatgrandparent');
        grandparent_element      = testDOM.find('#grandparent');
        parent_element           = testDOM.find('#parent')
        cousin_element           = testDOM.find('#cousin');
        element                  = testDOM.find('#element');

        element.addClass('selected')
      }));

      it('deselects when the parent is clicked', function() {
        parent_element.trigger('click')
        expect(element[0].className).toNotMatch('selected')
      });

      it('deselects when the grandparent is clicked', function() {
        grandparent_element.trigger('click')
        expect(element[0].className).toNotMatch('selected')
      });

      it('does NOT deselect when a great-grandparent is clicked', function() {
        greatgrandparent_element.trigger('click')
        expect(element).toNotMatch('selected')
      });

      it('deselects when a cousin is clicked', function() {
        cousin_element.trigger('click')
        expect(element[0].className).toNotMatch('selected')
      });
    });
  });
});
