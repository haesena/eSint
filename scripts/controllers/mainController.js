/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('mainController', ["$scope", "$rootScope", "Auth", "$state", "$stateParams", "$firebaseArray", "$firebaseObject",
        function($scope, $rootScope, Auth, $state, $stateParams, $firebaseArray, $firebaseObject) {
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

            if($scope.invite != undefined) {
                var uRef = firebase.database().ref().child("users").child($rootScope.firebaseUser.uid);
                uRef.child("groups/"+$scope.invite.group).set("invite");
                uRef.child("activeGroup").set($scope.invite.group);

                $rootScope.loadData($rootScope.firebaseUser.uid);
            }

            $state.go("home");
        }

        if($stateParams.inviteId !== undefined) {
            var iRef = firebase.database().ref().child("invites");
            $scope.invite = $firebaseObject(iRef.child($stateParams.inviteId));
        } else {
            $scope.invite = undefined;
        }
    }]);