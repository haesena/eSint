/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('wishesController', ["$scope", "$rootScope", "Auth", "$state", "$stateParams", "$firebaseArray", "$firebaseObject",
        function($scope, $rootScope, Auth, $state, $stateParams, $firebaseArray, $firebaseObject) {
            $rootScope.menuTitle = "My Wishlist";

            $scope.showLink = false;
            $scope.showForm = false;
            $scope.toggleLink = function() {
                $scope.showLink = !$scope.showLink;
            }
            
            $scope.createWish = function() {
                $scope.myWishlist.addWish($scope.newWish);
                $scope.showForm = false;

                $scope.newWish.name = "";
                $scope.newWish.link = "";
            }

            $scope.cancel = function() {
                $scope.showForm = false;

                $scope.newWish.name = "";
                $scope.newWish.link = "";
            }

            $scope.showNewWish = function() {
                $scope.showForm = true;
            }

        }]);