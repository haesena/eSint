/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('mainController', ["$scope", "$rootScope", "Auth", "$state", "$stateParams", "$firebaseArray", "$firebaseObject",
        function($scope, $rootScope, Auth, $state, $stateParams, $firebaseArray, $firebaseObject) {

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

            if($rootScope.inviteId !== undefined) {
                var iRef = firebase.database().ref().child("invites");
                $scope.invite = $firebaseObject(iRef.child($rootScope.inviteId));
                $scope.invite
                    .$loaded()
                    .then(function() {
                        $scope.inviteLoaded = true;
                    });

            } else {
                $scope.invite = undefined;
            }

    }]);