'use strict';

var app = angular.module('myApp.controllers');

app.controller('EndpointCtrl', ['$scope', function($scope) {

  var p = $scope.endpoint;

  $scope.$on('relocateIfAttachedToEntity', function(ev, entityID) {
    if (p.entity.id == entityID || p.otherEntity.id == entityID) {
      p.relocate();
      p.negotiateCoordinates();
    }
  });

  p.relocate();

}]);
