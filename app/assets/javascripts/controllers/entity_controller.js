'use strict';

function EntityCtrl($scope) {
  var changeEvent = function() {
    $scope.$emit('entityGeometryChange', $scope.entity.id);
  }

  _.each(['x', 'y', 'width', 'height'], function(attribute) {
    var trigger = _.bind($scope.entity.triggerUpdate, $scope.entity);
    $scope.$watch('entity.' + attribute, trigger); //old
    $scope.$watch('entity.' + attribute, changeEvent); //new
  });
}

angular.module('myApp.controllers').controller('EntityCtrl', EntityCtrl);

// For minification
EntityCtrl.$inject = ['$scope'];
