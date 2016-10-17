/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('aboutController', ["$scope", "$rootScope",
    function($scope, $rootScope, Page) {
        $scope.message = 'Look! I am an about page.';
        $rootScope.menuTitle = "About";
    }]);