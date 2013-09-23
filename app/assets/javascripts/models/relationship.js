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

  this.crosslink = function() {
    this.endpoints[0].partner = this.endpoints[1];
    this.endpoints[1].partner = this.endpoints[0];
  }

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
