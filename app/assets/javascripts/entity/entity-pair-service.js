(function() {
  angular.module('LDT.entity').factory('EntityPairService', function(PairDictionary, EntityPair) {

    function EntityPairService() {
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
    };

    return new EntityPairService;
  });
})();
