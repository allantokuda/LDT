window.SIDENAMES = ['top', 'bottom', 'left', 'right'];
window.ARROWHEAD_LENGTH = 30
window.ARROWHEAD_WIDTH = 20

window.Side = function(entity, sideName) {

  this.entity = entity;
  this.name = sideName;
  this.endpoints = [];

  this.removeEndpoint = function(endpointToDelete) {
    this.endpoints = _.reject(this.endpoints, function(endpoint) { return endpoint == endpointToDelete });
  }

  this.addEndpoint = function(endpointToAdd) {
    this.removeEndpoint(endpointToAdd);
    this.endpoints.push(endpointToAdd);
  }

}
