'use strict';

describe('grid', function(){
  var grid;

  beforeEach(module('LDT.geometry'));

  beforeEach(
    function() {
      angular.module('LDT.geometry').value('GRIDSIZE', 4);
    }
  );

  beforeEach(inject(function (_grid_) {
    grid = _grid_;
  }));

  describe('grid', function() {
    it('should snap to 0', function() {
      expect(grid.snap(0)).toEqual(0);
    });

    it('should snap to nearest grid value', function() {
      expect(grid.snap(-6)).toEqual(-4);
      expect(grid.snap(-5)).toEqual(-4);
      expect(grid.snap(-4)).toEqual(-4);
      expect(grid.snap(-3)).toEqual(-4);

      expect(grid.snap(-2)).toEqual( 0);
      expect(grid.snap(-1)).toEqual( 0);
      expect(grid.snap( 0)).toEqual( 0);
      expect(grid.snap( 1)).toEqual( 0);

      expect(grid.snap( 2)).toEqual( 4);
      expect(grid.snap( 3)).toEqual( 4);
      expect(grid.snap( 4)).toEqual( 4);
      expect(grid.snap( 5)).toEqual( 4);

      expect(grid.snap( 6)).toEqual( 8);
      expect(grid.snap( 7)).toEqual( 8);
      expect(grid.snap( 8)).toEqual( 8);
      expect(grid.snap( 9)).toEqual( 8);

      expect(grid.snap(10)).toEqual(12);
      expect(grid.snap(11)).toEqual(12);
      expect(grid.snap(12)).toEqual(12);
      expect(grid.snap(13)).toEqual(12);
    });
  });
});
