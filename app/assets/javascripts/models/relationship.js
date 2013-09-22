window.Relationship = function(id) {

  this.id = id;
  this.num = 0;
  this.endpoints = [];
  this.entities = [];

  // Allow the context (graph) to supply two endpoints
  this.setEndpoint = function(endpoint) {
    this.endpoints[this.num] = endpoint;
    this.entities[this.num] = endpoint.entity;
    this.num++;
  }

  // Just move this to the endpoint class so the logic is not needed...
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
