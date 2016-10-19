/**
 * Created by haesen on 13.10.2016.
 */

angular
    .module("eSint")
    .controller('mainController', ["$scope", "$rootScope", "Auth", "$state", "$stateParams", "$firebaseArray", "$firebaseObject", "$window",
        function($scope, $rootScope, Auth, $state, $stateParams, $firebaseArray, $firebaseObject, $window) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        $rootScope.menuTitle = "eSint";
        $scope.auth = Auth;

        $scope.logIn = function (type) {
            if(type == 'facebook') {
                $scope.auth.$signInWithPopup('facebook')
                    .then(function(ref) {
                        // addInvitedUsertoGroup(ref.user.uid, ref.user.displayName, ref.user.photoURL);
                    });
            } else if(type == 'google') {
                $scope.auth.$signInWithPopup('google')
                    .then(function(ref) {
                        // addInvitedUsertoGroup(ref.user.uid, ref.user.displayName, ref.user.photoURL);
                    });
            }
            $state.go("home");
        }

        var addInvitedUsertoGroup = function(uid, newName, newPhoto) {
            var uRef = firebase.database().ref().child("users").child(uid);
            uRef.child("groups/"+$scope.invite.group).set("invite");
            uRef.child("activeGroup").set($scope.invite.group);

            var gRef = firebase.database().ref().child("groups").child($scope.invite.group);

            var newUser = {
                type: "user",
                name: newName,
                photo: newPhoto
            }

            gRef.child("users/"+uid).set(newUser);

            // $rootScope.loadData(uid);
        }

        if($stateParams.inviteId !== undefined) {
            var iRef = firebase.database().ref().child("invites");
            $scope.invite = $firebaseObject(iRef.child($stateParams.inviteId));
        } else {
            $scope.invite = undefined;
        }
    }]);