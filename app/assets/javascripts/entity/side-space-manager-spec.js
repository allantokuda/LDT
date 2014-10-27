'use strict';

describe('Side space manager', function() {
  var SideSpaceManager;

  beforeEach(module('LDT.entity'));
  beforeEach(inject(function(_SideSpaceManager_) {
    SideSpaceManager = _SideSpaceManager_;
  }));

  // I'm decoupling this class from the entity class by giving it no intrinsic
  // understanding of horizontal/vertical orientation, and instead expecting an
  // object to be passed in that it will watch a property on -- which will
  // be Entity 'width' or 'height'.
  it('accepts an object and the property name from which to derive its range coordinates', function() {
    var entity = {
      y: 30,
      height: 100,
      verticalRange: function() {
        return {
          min: this.y,
          max: this.y+this.height
        }
      }
    };
    var manager = new SideSpaceManager(entity, 'verticalRange');
    expect(manager.vacancy()).toEqual({ min: 30, max: 130 });
  });
});