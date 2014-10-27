'use strict';

describe('Side space manager', function() {
  var SideSpaceManager;

  var exampleEntity = {
    y: 30,
    height: 100,
    verticalRange: function() {
      return {
        min: this.y,
        max: this.y+this.height
      }
    }
  };


  beforeEach(module('LDT.entity'));
  beforeEach(inject(function(_SideSpaceManager_) {
    SideSpaceManager = _SideSpaceManager_;
  }));

  // I'm decoupling this class from the entity class by giving it no intrinsic
  // understanding of horizontal/vertical orientation, and instead expecting an
  // object to be passed in that it will watch a property on -- which will
  // be Entity 'width' or 'height'.
  it('accepts an object and the property name from which to derive its range coordinates', function() {
    var manager = new SideSpaceManager(exampleEntity, 'verticalRange');
    expect(manager.vacancy()).toEqual({ min: 30, max: 130 });
  });

  it('allows space to be occupied from the top and bottom', function() {
    var manager = new SideSpaceManager(exampleEntity, 'verticalRange');
    manager.occupy(-1, 10);
    manager.occupy( 1, 20);
    expect(manager.vacancy()).toEqual({ min: 40, max: 110 });
  });

  it('returns null when all space is occupied', function() {
    var manager = new SideSpaceManager(exampleEntity, 'verticalRange');
    manager.occupy(-1, 99);
    expect(manager.vacancy()).toEqual({ min: 129, max: 130 });
    manager.occupy( 1,  1);
    expect(manager.vacancy()).toBeNull();
  });

  it('can be cleared to restore full vacancy', function() {
    var manager = new SideSpaceManager(exampleEntity, 'verticalRange');
    manager.occupy(-1, 20);
    manager.occupy( 1, 50);
    expect(manager.vacancy()).toEqual({ min: 50, max:  80 });
    manager.clear();
    expect(manager.vacancy()).toEqual({ min: 30, max: 130 });
  });
});