window.Relationship = function(r) {

  this.id = r.id;
  this.entities = [r.entity1, r.entity2];
  this.endpoints = [
    new Endpoint(self, r.entity1, r.label1, r.symbol1),
    new Endpoint(self, r.entity2, r.label2, r.symbol2)
  ];

  this.other = function(entity) {
    if      (entities[0] == entity) return entities[1];
    else if (entities[1] == entity) return entities[0];
    else
      return undefined;
  };

  this.saveObject = function() {
    return {
      id: id,
      entity1: entities[0],
      entity2: entities[1],
      symbol1: endpoints[0].symbol,
      symbol2: endpoints[1].symbol,
      label1:  endpoints[0].label,
      label2:  endpoints[1].label,
    };
  };
}
