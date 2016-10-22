/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('wishlistController', ["$scope", "$rootScope", "Auth", "$state", "$stateParams", "$firebaseArray", "$firebaseObject",
        function($scope, $rootScope, Auth, $state, $stateParams, $firebaseArray, $firebaseObject) {
            if($stateParams.user == "mine") {
                $rootScope.menuTitle = "My Wishlist";
            } else {
                if($stateParams.user == "mine") {
                    $rootScope.menuTitle = "My Wishlist";
                }
            }

            $rootScope.menuTitle = "Wishlists";

        }]);