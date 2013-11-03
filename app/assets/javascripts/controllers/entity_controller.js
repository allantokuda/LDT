'use strict';

function EntityCtrl($scope) {
  var changeEvent = function() {
    $scope.$emit('entityGeometryChange', $scope.entity.id);
  };

  _.each(['x', 'y', 'width', 'height'], function(attribute) {
    $scope.$watch('entity.' + attribute, changeEvent);
  });
}

angular.module('myApp.controllers').controller('EntityCtrl', EntityCtrl);

// For minification
EntityCtrl.$inject = ['$scope'];
