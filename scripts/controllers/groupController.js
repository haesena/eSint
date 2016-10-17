/**
 * Created by haesen on 15.10.2016.
 */

angular
    .module("eSint")
    .controller('groupController', ["$scope", "$rootScope", "$firebaseArray", "$firebaseObject", "$state", "$stateParams", "$mdDialog",
        function($scope, $rootScope, $firebaseArray, $firebaseObject, $state, $stateParams, $mdDialog) {

            // References for groups and user
            var gRef = firebase.database().ref().child("groups");
            var uRef = firebase.database().ref().child("users").child($rootScope.firebaseUser.uid);

            if($stateParams.action == "create") {
                $rootScope.menuTitle = "Groups > New";
            } else if($stateParams.action == "manage") {
                $rootScope.menuTitle = "Groups > Manage";
            } else {
                var uRef = firebase.database().ref().child("users").child($rootScope.firebaseUser.uid);
                uRef.child("activeGroup").set($stateParams.action);
                $state.go("home");
            }

            $scope.action = $stateParams.action;

            // create a message to display in our view
            $scope.createGroup = function() {

                var newUsers = {};
                newUsers[$rootScope.firebaseUser.uid] = "admin";

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

                $rootScope.loadData($rootScope.firebaseUser.uid);
                $state.go("home");
            }

            var removeUserFromGroup = function(gid, uid) {
                // delete the user-reference on the group
                $firebaseObject(gRef.child(gid).child("users").child(uid)).$remove();
                // If the group has no more users, it can be deleted
                $firebaseArray(gRef.child(gid).child("users"))
                    .$loaded()
                    .then(function(users) {
                        if(users.length == 0) {
                            $firebaseObject(gRef.child(gid)).$remove();
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });

                // delete the group-reference on the user
                $firebaseObject(uRef.child("groups").child(gid)).$remove();
                // if the user left the active group, we have to change the active group flag
                if($scope.user.activeGroup == gid) {
                    // read the groups from the user
                    $firebaseArray(uRef.child("groups"))
                        .$loaded()
                        .then(function(groups) {
                            // set the first group-id as active gorup
                            uRef.child("activeGroup").set(groups[0].$id);
                        })
                        .catch(function(error) {
                            // if the user has no more group-references, delete the active-group flag
                            $firebaseObject(uRef.child("activeGroup")).$remove();
                            $state.go("home");
                        });
                }

                // alert(JSON.stringify(uGroups));

            };

            $scope.leaveGroup = function(gid, ev) {
                var confirm = $mdDialog.confirm()
                    .title('Leave group?')
                    .textContent('Are you sure you want to leave the group '+gid+'?')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                var uid = $rootScope.firebaseUser.uid;

                $mdDialog.show(confirm).then(function() {
                    removeUserFromGroup(gid, uid);
                }, function() {
                });
            };

        }]);