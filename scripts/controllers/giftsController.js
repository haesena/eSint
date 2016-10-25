/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('giftsController', ["$scope", "$rootScope", "Auth", "$state", "$stateParams", "$firebaseArray", "$firebaseObject", "Giftlist", "$timeout",
        function($scope, $rootScope, Auth, $state, $stateParams, $firebaseArray, $firebaseObject, Giftlist, $timeout) {
            $rootScope.menuTitle = "My Gifts";

            $timeout(function() {
                $scope.userObj.$loaded()
                    .then(function(){
                        $scope.list = new Giftlist($scope.userObj.activeGroup, $scope);
                        console.log($scope.list);
                    });
            });

        }]);