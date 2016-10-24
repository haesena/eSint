/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('wishlistController', ["$scope", "$rootScope", "Auth", "$state", "$stateParams", "$firebaseArray", "$firebaseObject", "Wishlist",
        function($scope, $rootScope, Auth, $state, $stateParams, $firebaseArray, $firebaseObject, Wishlist) {
            $rootScope.menuTitle = "Wishlist";

            $scope.userObj.$loaded()
                .then(function(list){
                    console.log($scope.userObj.activeGroup);
                    $scope.list = new Wishlist($scope.userObj.activeGroup, $stateParams.user, $scope);
                });

        }]);