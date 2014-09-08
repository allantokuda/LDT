(function() {

  var PairDictionary = function() {
    this.dict = {};
  };

  key = function(key1, key2) {
    return key1 + ',' + key2;
  }

  PairDictionary.prototype = {
    set: function(key1, key2, value) {
      this.dict[key(key1, key2)] = value;
    },
    get: function(key1, key2) {
      return this.dict[key(key1, key2)];
    },
    delete: function(key1, key2) {
      delete this.dict[key(key1, key2)];
    },
    count: function() {
      return Object.keys(this.dict).length
    }
  }

  angular.module('lib').value('PairDictionary', PairDictionary);

})();
