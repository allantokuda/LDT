(function() {
  angular.module('LDT.entity').service('EntityPairService', function(PairDictionary, EntityPair) {
    var dict = new PairDictionary();
    this.pairs = [];

    this.updateList = function() {
      this.pairs = dict.values();
    }

    this.count = function() {
      return dict.count();
    };

    this.addRelationship = function(r) {
      var pair = dict.get(r.entity1.id, r.entity2.id);
      if (pair == undefined) {
        pair = new EntityPair(r.entity1, r.entity2);
      }
      pair.relationships.push(r);
      dict.set(r.entity1.id, r.entity2.id, pair);
      this.updateList();
    };

    this.removeRelationship = function(r) {
      var pair = dict.get(r.entity1.id, r.entity2.id);

      // If already non-existent, for now I'll treat it as
      // outdated data being synchronized
      if (pair !== undefined) {

        // Need to use while loop because the array
        // reduces in length as I iterate over it
        var i = 0;
        while (i < pair.relationships.length) {
          if (pair.relationships[i] == r) {
            // Number of relationships in a pair should
            // rarely be more than about 4 or 5 in the
            // real world, and should not be constantly
            // changing, so I'm not concerned about
            // looping over the list or creating memory
            // garbage when splicing
            pair.relationships.splice(i,1);
          } else {
            i++;
          }
        }

        if (pair.relationships.length == 0) {
          dict.delete(r.entity1.id, r.entity2.id);
        } else {
          dict.set(r.entity1.id, r.entity2.id, pair);
        }
        this.updateList();
      }
    };

    this.pairsOnEntity = function(entity) {
      return dict.match(entity.id);
    };

    // Return which objects (entities and entity pairs) that are affected when
    // a set of entities moves.
    //
    // - List of entities is used to determine which entities need to reset
    // their Sides (space managers) for endpoint reattachment.
    //
    // - List of entity pairs is used to determine which relationships need to
    // be readrawn (and they must be drawn as groups within the same entity
    // pair to ensure that "sibling" relationships cooperate and are drawn
    // parallel to each other).
    //
    // Input is a set, to allow multiple entities to be moved at once in the
    // future, though currently only one can be moved at a time.
    this.whoCaresAbout = function(movedEntities) {
      // the moved entities themselves are affected by their own movement
      var affectedEntities = movedEntities;
      var affectedPairs = [];

      for (var i in movedEntities) {
        var movedEntity = movedEntities[i];
        firstLevelPairs = this.pairsOnEntity(movedEntity);

        for (var j in firstLevelPairs) {
          var firstLevelPair = firstLevelPairs[j];
          if (firstLevelPair.entity1 == movedEntity) {
            otherEntity = firstLevelPair.entity2;
          } else {
            otherEntity = firstLevelPair.entity1;
          }
          affectedEntities = affectedEntities.concat(otherEntity);
          affectedPairs = affectedPairs.concat(this.pairsOnEntity(otherEntity));
        }
      }
      return {
        entities: $.unique(affectedEntities),
        pairs:    $.unique(affectedPairs)
      };
    };
  });
})();