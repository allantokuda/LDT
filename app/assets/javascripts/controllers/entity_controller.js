'use strict';

angular.module('myApp.controllers').controller('EntityCtrl', function($scope) {
  _.each(['x', 'y', 'width', 'height'], function(attribute) {
    var trigger = _.bind($scope.entity.triggerUpdate, $scope.entity);
    $scope.$watch('entity.' + attribute, trigger);
  });
});

// For minification
EntityCtrl.$inject = ['$scope'];
