'use strict';

var app = angular.module('myApp.controllers');

app.controller('PageCtrl', ['$scope', function($scope) {

  $scope.title = '';
  $scope.$on('titlechange', function(scope, newTitle) {
    $scope.title = newTitle;
  });

}]);
