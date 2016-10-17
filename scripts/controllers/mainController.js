/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('mainController', ["$scope", "$rootScope", "Auth",
        function($scope, $rootScope, Auth) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        $rootScope.menuTitle = "eSint";
        $scope.auth = Auth;

        $scope.logIn = function () {
            $scope.auth.$signInWithPopup('facebook');
        }
    }]);