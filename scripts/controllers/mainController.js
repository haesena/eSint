/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('mainController', ["$scope", "$rootScope", "Auth", "$state",
        function($scope, $rootScope, Auth, $state) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        $rootScope.menuTitle = "eSint";
        $scope.auth = Auth;

        $scope.logIn = function (type) {
            if(type == 'facebook') {
                $scope.auth.$signInWithPopup('facebook');
            } else if(type == 'google') {
                $scope.auth.$signInWithPopup('google');
            }
            $state.go("home");
        }
    }]);