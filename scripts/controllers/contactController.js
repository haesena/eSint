/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('contactController', ["$scope", "$rootScope",
        function($scope, $rootScope, Page) {
        // create a message to display in our view
        $scope.message = 'Contact us! JK. This is just a demo.';
        $rootScope.menuTitle = "Contact";
    }]);