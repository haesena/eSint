/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('wishesController', ["$scope", "$rootScope", "$firebaseArray", "$firebaseObject", "$timeout", "$mdDialog",
        function($scope, $rootScope, $firebaseArray, $firebaseObject, $timeout, $mdDialog) {
            $rootScope.menuTitle = "My Wishlist";

            $scope.showLink = false;
            $scope.showForm = false;
            $scope.editMode = false;
            $scope.editWishId = null;
            $scope.editWishOld = {};

            $scope.toggleLink = function() {
                $scope.showLink = !$scope.showLink;
            }

            $scope.toggleEditLink = function() {
                $scope.showEditLink = !$scope.showEditLink;
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

            $scope.toggleEditWish = function(wishId) {
                if(wishId === $scope.editWishId) {
                    $scope.editWishId = null;
                    $scope.showEditLink = false;

                    $scope.unbindEditWish();
                    $scope.unbindEditWish = null;
                } else if($scope.editWishId === null) {

                    var eRef = $scope.myWishlist.$ref().child("wishes/"+wishId);

                    $firebaseObject(eRef)
                        .$loaded()
                        .then(function(w){
                            if(w.linkURL !== undefined && w.linkURL.length > 0)
                                $scope.showEditLink = true;
                            else
                                $scope.showEditLink = false;

                            w.$bindTo($scope, "editWish")
                                .then(function(unbind) {
                                    $scope.unbindEditWish = unbind;
                                });
                        });

                    $scope.editWishId = wishId;

                    $firebaseArray(eRef)
                        .$loaded()
                        .then(function(w){
                            for(var i = 0; i < w.length; i++) {
                                if(w[i].$value == undefined)
                                    continue;
                                $scope.editWishOld[w[i].$id] = w[i].$value;
                            }
                        });

                }

                $scope.deleteWish = function(wishId) {
                    // console.log(wid);
                    // alert(wishId);
                    // var msg = "Are you sure you want to delete the wish?";
                    console.log($scope.myWishlist);
                    // var confirm = $mdDialog.confirm()
                    //     .title('Delete Wish?')
                    //     .textContent(msg)
                    //     .ariaLabel('Delete Wish')
                    //     .targetEvent(ev)
                    //     .ok('Yes')
                    //     .cancel('No');
                    //
                    // $mdDialog.show(confirm).then(function() {
                    //     console.log(wid);
                    // }, function() {
                    // });

                }

                $scope.cancelEditWish = function() {

                    var eRef = $scope.myWishlist.$ref().child("wishes/"+$scope.editWishId);

                    for(var id in $scope.editWishOld) {
                        eRef.child(id).set($scope.editWishOld[id]);
                    }

                    $scope.editWishOld = {};

                    $scope.editWishId = null;
                    $scope.showEditLink = false;

                    $scope.unbindEditWish();
                    $scope.unbindEditWish = null;
                }
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

            $scope.showStatus = function() {
                console.log($scope.isOpen);
            }

            this.isOpen = {};

        }]);
