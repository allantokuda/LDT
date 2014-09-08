(function() {
  angular.module('LDT.entity').factory('EntityPairService', function(PairDictionary) {

    function EntityPair(entity1, entity2) {
      this.entity1 = entity1;
      this.entity2 = entity2;
      this.relationships = [];
      this.pairs = [];
    }

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
    };

    return new EntityPairService;
  });
})();
