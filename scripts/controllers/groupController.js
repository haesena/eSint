/**
 * Created by haesen on 15.10.2016.
 */

angular
    .module("eSint")
    .controller('groupController', ["$scope", "$rootScope", "$firebaseArray", "$firebaseObject", "$state", "$stateParams",
        function($scope, $rootScope, $firebaseArray, $firebaseObject, $state, $stateParams) {

            if($stateParams.action != "create" && $stateParams.action != "manage") {
                var uRef = firebase.database().ref().child("users").child($rootScope.firebaseUser.uid);
                uRef.child("activeGroup").set($stateParams.action);
                $state.go("home");
            }

            $scope.action = $stateParams.action;

            // create a message to display in our view
            $scope.createGroup = function() {
                var gRef = firebase.database().ref().child("groups");
                var uRef = firebase.database().ref().child("users").child($rootScope.firebaseUser.uid);

                newUsers = {};
                newUsers[$rootScope.firebaseUser.uid] = "creator";

                var group = {
                    name: $scope.newName,
                    users: newUsers
                };

                if($scope.newDescription != undefined)
                    group.description = $scope.newDescription;

                $firebaseArray(gRef).$add(group).then(function(ref) {
                    uRef.child("groups/"+ref.key).set("creator");
                    uRef.child("activeGroup").set(ref.key);
                });

                $state.go("home");
            }

        }]);