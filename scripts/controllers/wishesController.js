/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('wishesController', ["$scope", "$rootScope", "Auth", "$state", "$stateParams", "$firebaseArray", "$firebaseObject",
        function($scope, $rootScope, Auth, $state, $stateParams, $firebaseArray, $firebaseObject) {
            $rootScope.menuTitle = "My Wishlist";

        }]);