(function() {

  var SIDES      = ['top', 'bottom', 'left', 'right'];
  var DIRECTIONS = ['up', 'down', 'left', 'right'];

  function EntityPair(entity1, entity2) {
    this.entity1 = entity1;
    this.entity2 = entity2;
    this.relationships = [];
    this.pairs = [];

    this.swapEntities = function() {
      var swap = this.entity2;
      this.entity2 = entity1;
      this.entity1 = swap;
    }

    this.orientation = function() {
      var directionFromFirstToSecond = _.max(DIRECTIONS, function(direction) {
        return this.outwardDistance(direction);
      }, this);

      switch(directionFromFirstToSecond) {
        case 'up':
          this.swapEntities();
        case 'down':
          return 1;
        case 'left':
          this.swapEntities();
        case 'right':
          return 0;
      }
    }

    this.outwardDistance = function(direction) {
      return ({
        left:  this.entity1.x - this.entity2.x - this.entity2.width,  // e2 is to the left of e1
        up:    this.entity1.y - this.entity2.y - this.entity2.height, // e2 is above e1
        right: this.entity2.x - this.entity1.x - this.entity1.width,  // e2 is to the right of e1
        down:  this.entity2.y - this.entity1.y - this.entity1.height  // e2 is below e1
      })[direction];
    };

  }

  angular.module('LDT.entity').value('EntityPair', EntityPair);
})();
