'use strict';

describe('selectWith', function() {
  var element;
  var $compile, $rootScope;
  var scope, parent_element, sibling;

  beforeEach(module('LDT.ui'));
  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    //TODO: define the class to apply in the directive, as well as the class on all siblings.
    parent_element = $compile('<div><div select-with="click as entity" id="element"></div><div select-with="click as sibling" id="sibling"></div></div>')($rootScope);
    element = parent_element.find('#element');
    sibling = parent_element.find('#sibling');
    scope = element.scope();
  }));

  it('triggers on arbitrary javascript events', function() {
    element = $compile('<div select-with="dblclick as doubleClicker"></div>')($rootScope);
    element.trigger('dblclick');
    expect(element).toHaveClass('selected');
  });

  describe('response to click events', function() {

    describe('when the element is not already selected', function() {
      it('should get the "selected" class', function() {
        scope.selected = false;
        element.trigger('click');
        expect(element).toHaveClass('selected');
      });
    });

    describe('when the element is already selected', function() {
      it('should retain the "selected" class', function() {
        scope.selected = true;
        element.addClass('selected');
        element.trigger('click');
        expect(element).toHaveClass('selected');
      });
    });
  });

  it('becomes deselected when a deselect broadcast event is received', function() {
    element.trigger('dblclick');
    $rootScope.$broadcast('deselectAll');
    expect(element[0].className).toNotMatch(/selected/);
  });
});
