(function() {

  var PairDictionary = function() {
    var dict = {};

    this.set = function(key1, key2, value) {
      dict[key(key1, key2)] = value;
    };

    this.get = function(key1, key2) {
      return dict[key(key1, key2)];
    };

    this.delete = function(key1, key2) {
      delete dict[key(key1, key2)];
    };

    this.count = function() {
      return Object.keys(dict).length
    };

    this.values = function() {
      return $.map(dict, function(value, key) {
        return value;
      });
    };
  };

  key = function(key1, key2) {
    return key1 + ',' + key2;
  }

  PairDictionary.prototype = {
  }

  angular.module('lib').value('PairDictionary', PairDictionary);

})();
