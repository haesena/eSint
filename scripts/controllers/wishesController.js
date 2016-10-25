/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('wishesController', ["$scope", "$rootScope", "$firebaseArray", "$firebaseObject", "$timeout",
        function($scope, $rootScope, $firebaseArray, $firebaseObject, $timeout) {
            $rootScope.menuTitle = "My Wishlist";

            $scope.showLink = false;
            $scope.showForm = false;
            $scope.editMode = false;

            $scope.toggleLink = function() {
                $scope.showLink = !$scope.showLink;
            }
            
            $scope.createWish = function() {
                $scope.myWishlist.addWish($scope.newWish);
                $scope.cancel();
            }

            $scope.cancel = function() {
                $scope.showForm = false;

                $scope.newWish.name = "";
                $scope.newWish.linkTitle = "";
                $scope.newWish.linkURL = "";
            }

            $scope.showNewWish = function() {
                $scope.showForm = true;
            }

            $scope.toggleEdit = function() {
                if($scope.editMode) {
                    $scope.editMode = false;

                    $scope.unbindEditName();
                    $scope.unbindEditName = null;
                } else {
                    $scope.editMode = true;

                    $scope.myWishlist
                        .$bindTo($scope, "editList")
                        .then(function(unbind) {
                            $scope.unbindEditName = unbind;
                        });
                }
            }

        }]);