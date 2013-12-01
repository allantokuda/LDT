'use strict';

var app = angular.module('LDT.controllers');

app.controller('PageCtrl', ['$scope', function($scope) {

  $scope.title = '';
  $scope.$on('titlechange', function(scope, newTitle) {
    $scope.title = newTitle;
  });

}]);
