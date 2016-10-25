/**
 * Created by haesen on 18.10.2016.
 */
/**
 * Add a Book factory object which parses dates
 */
angular
    .module("eSint")
    .factory('User', function ($firebaseObject, $firebaseArray, $firebase, $timeout, Wishlist) {

        var $theScope;

        var User = $firebaseObject.$extend({
            isLoaded: function() {
                return this.name;
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

            leaveGroup: function(gid) {
                var myRef = this.$ref();
                var gRef = firebase.database().ref().child("groups");

                if(this.activeGroup == gid) {
                    var newActiveGroup = null;
                    for(var g in $theScope.userGroups)
                        if(g != gid)
                            newActiveGroup = g;

                    myRef.child("activeGroup").set(newActiveGroup);
                }

                if(this.isLastAdmin(gid)) {
                    $firebaseObject(gRef.child(gid)).$remove();
                } else {
                    $firebaseObject(gRef.child(gid).child("users/"+this.$id)).$remove();
                }

                $firebaseObject(myRef.child("groups/"+gid)).$remove();

            },

            set: function(path, value) {
                var myRef = this.$ref();
                myRef.child(path).set(value);
            },

            consumeInvite: function(inviteId) {
                var myRef = this.$ref();
                var uid = this.$id;
                var name = this.name;
                var photo = this.photo;


                $firebaseObject(firebase.database().ref().child("invites/"+inviteId))
                    .$loaded()
                    .then(function(invite){
                        if(invite.groupName == undefined)
                            return;

                        myRef.child("groups/"+invite.group).set("invite")
                        myRef.child("activeGroup").set(invite.group);

                        var gRef = firebase.database().ref().child("groups/"+invite.group);

                        var newUser = {
                            type: "user",
                            name: name,
                            photo: photo
                        }

                        gRef.child("users/"+uid).set(newUser)
                            .then(function() {
                                addGroup(invite.group);
                            });
                    });

            }
        });

        function addGroup(gid) {
            var groupsRef = firebase.database().ref().child("groups");
            groupsRef.child(gid).on('value', function(snap) {
                $timeout(function() {
                    if( snap.val() === null ) {
                        // the book was deleted
                        delete $theScope.userGroups[groupId];
                    }
                    else {
                        $theScope.userGroups[gid] = snap.val();
                    }
                });
            });
        }

        return function(uid, $scope) {
            $theScope = $scope;
            $theScope.userGroups = {};
            $theScope.myWishlist = {};
            $theScope.wishlists = {};
            $theScope.myGifts = {};

            var indexRef = firebase.database().ref().child("users/"+uid+"/groups");

            indexRef.on('child_added', function(indexSnap) {
                addGroup(indexSnap.key);
            });

            indexRef.on('child_removed', function(snap) {
                $timeout(function() {
                    delete $theScope.userGroups[snap.key];
                });
            });

            firebase.database().ref().child("users/"+uid+"/activeGroup")
                .on('value', function(snap) {
                    $theScope.myWishlist = new Wishlist(snap.val(), uid, $scope);
                    $theScope.wishlists = {};
                    $theScope.myGifts = {};

                    var listsRef = firebase.database().ref().child("wishlists/"+snap.val());

                    listsRef.on('child_added', function(indexSnap) {
                        if(indexSnap.key != uid) {
                            $theScope.wishlists[indexSnap.key] = new Wishlist(snap.val(), indexSnap.key, $scope);
                        }
                    });

                    listsRef.on('child_removed', function(snap) {
                        $timeout(function() {
                            delete $theScope.wishlists[snap.key];
                        });
                    });

                    var giftsRef = firebase.database().ref().child("gifts/"+snap.val()+"/"+uid);
                });

            var ref = firebase.database().ref().child("users").child(uid);
            return new User(ref);
        }

    });