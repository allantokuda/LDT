'use strict';

function EndpointCtrl($scope) {
  var p = $scope.endpoint

  $scope.$on('relocateIfAttachedToEntity', function(ev, entityID) {
    if (p.entity.id == entityID || p.otherEntity.id == entityID) {
      p.relocate();
      p.negotiateCoordinates();
    }
  });

  p.relocate();
}

angular.module('myApp.controllers').controller('EndpointCtrl', EndpointCtrl);

// For minification
EndpointCtrl.$inject = ['$scope'];
