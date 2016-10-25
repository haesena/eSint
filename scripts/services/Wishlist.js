/**
 * Created by haesen on 23.10.2016.
 */
angular
    .module("eSint")
    .factory('Wishlist', function ($firebaseObject, $firebaseArray, $firebase, $timeout, $rootScope) {

        var myWishlist = false;
        var takenFlags;
        var $theScope;
        var _gid;
        var _uid;

        var Wishlist = $firebaseObject.$extend({
            empty: function() {

            },

            bindTo: function(child, scopeVar) {
                console.log("binding "+child+" to "+scopeVar);
            },

            set: function(path, value) {
                var myRef = this.$ref();
                myRef.child(path).set(value);
            },

            isTaken: function(wishId) {
                return takenFlags[wishId] == true;
            },

            takeWish: function(wishId) {

                if(this.isTaken(wishId))
                    return;

                var tfRef = takenFlags.$ref();
                tfRef.child(wishId).set(true);

                var newGift = {
                    status: "open",
                    name: this.wishes[wishId].name,
                    user: $theScope.userGroups[_gid].users[_uid].name,
                    userPhoto: $theScope.userGroups[_gid].users[_uid].photo,
                };

                $theScope.myGifts.$ref().child(wishId).set(newGift);
            },

            canTakeBack: function(wishId) {
                if($theScope.myGifts[wishId] === undefined)
                    return false;
                else
                    return true;
            },

            takeBack: function(wishId) {
                if(!this.canTakeBack(wishId))
                    return;

                $firebaseObject($theScope.myGifts.$ref().child(wishId)).$remove();
                $firebaseObject(takenFlags.$ref().child(wishId)).$remove();
            },

            wishActionImg: function(wishId) {
                if(this.canTakeBack(wishId))
                    return "fa fa-trash-o fa-2";

                if(!this.isTaken(wishId))
                    return "fa fa-gift fa-2";

                return false;
            },

            wishAction: function(wishId) {
                if(this.canTakeBack(wishId)) {
                    this.takeBack(wishId);
                    return;
                }

                if(!this.isTaken(wishId)) {
                    this.takeWish(wishId);
                    return;
                }
            },

            addWish: function(wish) {
                if(!myWishlist)
                    return;

                var myRef = this.$ref();
                $firebaseArray(myRef.child("wishes")).$add(wish);
            }
        });

        return function(gid, uid, $scope) {
            $theScope = $scope;
            _gid = gid;
            _uid = uid;

            var ref = firebase.database().ref().child("wishlists/"+gid+"/"+uid);
            var wishlist = new Wishlist(ref);

            if(uid == $rootScope.firebaseUser.uid) {
                myWishlist = true;
                wishlist.$loaded()
                    .then(function(list){
                        if(list.name == null) {
                            wishlist.set("name", $rootScope.firebaseUser.displayName+"s Wishlist");
                        }
                        wishlist.set("img", $rootScope.firebaseUser.photoURL);
                    });
            } else {
                takenFlags = $firebaseObject(firebase.database().ref().child("takenFlag/"+gid+"/"+uid));
            }

            return wishlist;
        }
    });