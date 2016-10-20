/**
 * Created by haesen on 18.10.2016.
 */
/**
 * Add a Book factory object which parses dates
 */
angular
    .module("eSint")
    .factory('User', function ($firebaseObject) {

        var gRef = firebase.database().ref().child("groups");

        var unbinders = {};
        var $theScope;

        var User = $firebaseObject.$extend({
            isLoaded: function() {
                return this.name;
            },
            $$updated: function(snap) {
                var changed = $firebaseObject.prototype.$$updated.apply(this, arguments);

                // if the userdata changed
                if(changed) {

                    // loop over all groups that we currently have in the scope
                    for(var gid in $theScope.userGroups) {
                        // if this groups is not in the updated data, the user left the group, so we have to unbind the reference
                        if(snap.val().groups[gid] === undefined) {
                            console.log("unbind "+gid);
                            // unbind if the function is defined
                            if(unbinders[gid]) unbinders[gid]();
                            // delete the gorup from the scope
                            delete $theScope.userGroups[gid];
                            // delete the function to unbind
                            delete unbinders[gid];
                        }
                    }

                    // loop over the groups that are in the updated data
                    for(var gid in snap.val().groups) {
                        // if the gorup is not in the scope, the user joined the group, we have to add it
                        if($theScope.userGroups.gid === undefined) {
                            console.log("creating reference for "+gid);
                            // create a reference to the group and save the unbind-function for later
                            $firebaseObject(firebase.database().ref().child("groups").child(gid))
                                .$bindTo($theScope, "userGroups['" + gid + "']")
                                .then(function (ub) {
                                    unbinders[gid] = ub;
                                });
                        }
                    }
                }
                
                return changed;
            },

            isLastAdmin: function(gid) {
                if($theScope.userGroups[gid].users[this.$id].type != "admin")
                    return false;

                var ret = true;

                for(u in $theScope.userGroups[gid].users) {
                    if(u != this.$id && $theScope.userGroups[gid].users[u].type == "admin")
                        return false;
                }

                return true;
            },

            removeGroup: function(gid) {
                var myRef = this.$ref();
                var gRef = firebase.database().ref().child("groups");

                if(this.activeGroup == gid) {
                    var newActiveGroup = null;
                    for(var g in $theScope.userGroups)
                        if(g != gid)
                            newActiveGroup = g;

                    // this.activeGroup = newActiveGroup;
                    myRef.child("activeGroup").set(newActiveGroup);
                    // alert("setting active group to "+newActiveGroup);
                }

                if(this.isLastAdmin(gid)) {
                    $firebaseObject(gRef.child(gid)).$remove();
                } else {
                    $firebaseObject(gRef.child(gid).child("users/"+this.$id)).$remove();
                }

                $firebaseObject(myRef.child("groups/"+gid)).$remove();
                if(unbinders[gid]) unbinders[gid]();
                delete $theScope.userGroups[gid];
                delete unbinders[gid];
                //
                /*

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

                 // $rootScope.loadData($rootScope.firebaseUser.uid);
                 $state.go("home");
                 });
                 }

                 */


            }
        });


        return function(uid, $scope) {
            $theScope = $scope;
            $theScope.userGroups = {};
            var ref = firebase.database().ref().child("users").child(uid);
            return new User(ref);
        }

    });