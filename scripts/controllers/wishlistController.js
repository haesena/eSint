/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('wishlistController', ["$scope", "$rootScope", "Auth", "$state", "$stateParams", "$firebaseArray", "$firebaseObject", "Wishlist", "$timeout",
        function($scope, $rootScope, Auth, $state, $stateParams, $firebaseArray, $firebaseObject, Wishlist, $timeout) {
            $rootScope.menuTitle = "Wishlist";

            $timeout(function() {
                $scope.userObj.$loaded()
                    .then(function(){
                        $scope.list = new Wishlist($scope.userObj.activeGroup, $stateParams.user, $scope);
                        
                    });
            });

        }]);