'use strict';

function EntityCtrl($scope) {
  _.each(['x', 'y', 'width', 'height'], function(attribute) {
    var trigger = _.bind($scope.entity.triggerUpdate, $scope.entity);
    $scope.$watch('entity.' + attribute, trigger);
  });
}

angular.module('myApp.controllers').controller('EntityCtrl', EntityCtrl);

// For minification
EntityCtrl.$inject = ['$scope'];
