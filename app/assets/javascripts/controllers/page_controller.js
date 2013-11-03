'use strict';

function PageCtrl($scope) {
  $scope.title = '';
  $scope.$on('titlechange', function(scope, newTitle) {
    $scope.title = newTitle;
  });
}

angular.module('myApp.controllers').controller('PageCtrl', PageCtrl);

// For minification
PageCtrl.$inject = ['$scope'];
