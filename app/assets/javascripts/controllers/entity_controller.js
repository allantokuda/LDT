'use strict';

var app = angular.module('myApp.controllers');

app.controller('EntityCtrl', ['$scope', function($scope) {

  var changeEvent = function() {
    $scope.$emit('entityGeometryChange', $scope.entity.id);
  };

  _.each(['x', 'y', 'width', 'height'], function(attribute) {
    $scope.$watch('entity.' + attribute, changeEvent);
  });

}]);
