/**
 * Created by haesen on 15.10.2016.
 */

angular
    .module("eSint")
    .controller('groupController', ["$scope", "$rootScope", "$firebaseArray", "$firebaseObject", "$state", "$stateParams", "$mdDialog", "$mdPanel", "$location",
        function($scope, $rootScope, $firebaseArray, $firebaseObject, $state, $stateParams, $mdDialog, $mdPanel, $location) {

            // References for groups and user
            var gRef = firebase.database().ref().child("groups");
            var uRef = firebase.database().ref().child("users").child($rootScope.firebaseUser.uid);

            $state.oldGroup = {};

            if($stateParams.action == "create") {
                $rootScope.menuTitle = "Groups > New";
            } else if($stateParams.action == "manage") {
                $rootScope.menuTitle = "Groups > Manage";
            }  else if($stateParams.action == "edit") {
                $rootScope.menuTitle = "Groups > Edit";

                $firebaseObject(gRef.child($stateParams.gid))
                    .$bindTo($scope, "editGroup");

                var oldGroup = {};
                $firebaseArray(gRef.child($stateParams.gid))
                    .$loaded()
                    .then(function(group){
                        for(var i = 0; i < group.length; i++) {
                            if(group[i].$value == undefined)
                                continue;
                            oldGroup[group[i].$id] = group[i].$value;
                        }
                    });

                $scope.cancelEdit = function() {
                    for(var id in oldGroup) {
                        gRef.child($stateParams.gid).child(id).set(oldGroup[id]);
                    }
                    $state.go('groups', { 'action':'manage'});
                }

            } else {
                var uRef = firebase.database().ref().child("users").child($rootScope.firebaseUser.uid);
                uRef.child("activeGroup").set($stateParams.action);
                $state.go("home");
            }

            $scope.action = $stateParams.action;

            // create a message to display in our view
            $scope.createGroup = function() {

                var newUsers = {};
                newUsers[$rootScope.firebaseUser.uid] = {
                    type: "admin",
                    name: $rootScope.firebaseUser.displayName,
                    photo: $rootScope.firebaseUser.photoURL
                };

                var group = {
                    name: $scope.newName,
                    users: newUsers
                };

                if($scope.newDescription != undefined)
                    group.description = $scope.newDescription;

                $firebaseArray(gRef).$add(group).then(function(ref) {
                    uRef.child("groups/"+ref.key).set("creator");
                    uRef.child("activeGroup").set(ref.key);

                    $rootScope.loadData($rootScope.firebaseUser.uid);
                    $state.go("home");
                });
            }

            $scope.inviteGroup = function(gid, gName) {
                var iRef = firebase.database().ref().child("invites");

                $firebaseObject(iRef)
                    .$loaded()
                    .then(function(invites){

                        var found = false;
                        var newInvite = {
                            user: $rootScope.firebaseUser.uid,
                            userName: $rootScope.firebaseUser.displayName,
                            group: gid,
                            groupName: gName
                        };

                        for(var iid in invites) {
                            if(invites[iid] == undefined)
                                continue;
                            if(invites[iid].group == newInvite.group && invites[iid].user == newInvite.user) {
                                found = true;
                                break;
                            }
                        }

                        if(found) {
                            $scope.showInvite(iid);
                        } else {
                            $firebaseArray(iRef).$add(newInvite).then(function(ref) {
                                $scope.showInvite(ref.key);
                            });
                        }

                    });

            }

            $scope.showInvite = function(iid) {

                var inviteURL = $location.absUrl().split('?')[0];
                inviteURL = inviteURL.replace("groups/manage", "invite/"+iid);

                var position = $mdPanel.newPanelPosition()
                    .absolute()
                    .center();

                var config = {
                    attachTo: angular.element(document.body),
                    controller: PanelDialogCtrl,
                    controllerAs: 'ctrl',
                    disableParentScroll: this.disableParentScroll,
                    templateUrl: 'partials/invite.tmpl.html',
                    hasBackdrop: true,
                    panelClass: 'demo-dialog-example',
                    position: position,
                    trapFocus: true,
                    zIndex: 150,
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    focusOnOpen: true,
                    locals: {
                        'inviteURL': inviteURL
                    },
                };

                $mdPanel.open(config);
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

                            $rootScope.loadData($rootScope.firebaseUser.uid);
                            $state.go("home");
                        });
                }

                $rootScope.loadData($rootScope.firebaseUser.uid);

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

function PanelDialogCtrl(mdPanelRef) {
    this._mdPanelRef = mdPanelRef;
}

PanelDialogCtrl.prototype.closeDialog = function() {
    var panelRef = this._mdPanelRef;

    panelRef && panelRef.close().then(function() {
        panelRef.destroy();
    });
};