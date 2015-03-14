'use strict';

var app = angular.module('LDT.controllers');

app.controller('EntityCtrl', ['$scope', function($scope) {

  var changeEvent = function() {
    $scope.entity.notifyChange();
  };

  _.each(['x', 'y', 'width', 'height'], function(attribute) {
    $scope.$watch('entity.' + attribute, changeEvent);
  });

}]);
