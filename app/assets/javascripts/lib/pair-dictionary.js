(function() {
  var PairDictionary = function() {
    //Primary: look up values by pair of keys concatenated by a string.
    //Uses single actual key comprising two "keys" string-concatenated
    var pairDict = {};

    //Secondary: enable looking up values by providing just one of the two keys.
    //May return multiple values, so this object's values should be arrays.
    var index = {};

    function key(key1, key2) {
      return key1 + ',' + key2;
    }

    this.set = function(key1, key2, value) {
      pairDict[key(key1, key2)] = value;
      addToIndex(key1, key2, value);
    };

    this.get = function(key1, key2) {
      return pairDict[key(key1, key2)];
    };

    this.delete = function(key1, key2) {
      delete pairDict[key(key1, key2)];
      deleteFromIndex(key1, key2);
    };

    this.count = function() {
      return Object.keys(pairDict).length
    };

    this.values = function() {
      return $.map(pairDict, function(value, key) {
        return value;
      });
    };

    this.match = function(matchKey) {
      var result = [];
      for (var key in index[matchKey])
        result.push(index[matchKey][key]);

      return result;
    };

    function addToIndex(key1, key2, value) {
      if (index[key1] === undefined)
        index[key1] = {};

      if (index[key2] === undefined)
        index[key2] = {};

      index[key1][key2] = value;
      index[key2][key1] = value;
    };

    function deleteFromIndex(key1, key2) {
      delete index[key1][key2];
      delete index[key2][key1];

      if ($.isEmptyObject(index[key1]))
        delete index[key1];

      if ($.isEmptyObject(index[key2]))
        delete index[key2];
    };
  };

  angular.module('lib').value('PairDictionary', PairDictionary);
})();
