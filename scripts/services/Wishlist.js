/**
 * Created by haesen on 23.10.2016.
 */
angular
    .module("eSint")
    .factory('Wishlist', function ($firebaseObject, $firebaseArray, $firebase, $timeout, $rootScope) {

        var myWishlist = false;
        var takenFlags;

        var Wishlist = $firebaseObject.$extend({
            empty: function() {

            },

            set: function(path, value) {
                var myRef = this.$ref();
                myRef.child(path).set(value);
            },

            isTaken: function(wishId) {
                return takenFlags[wishId] == true;
            },

            takeWish: function(wishId) {
                var tfRef = takenFlags.$ref();
                tfRef.child(wishId).set(true);
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

            var ref = firebase.database().ref().child("wishlists/"+gid+"/"+uid);
            var wishlist = new Wishlist(ref);

            if(uid == $rootScope.firebaseUser.uid) {
                myWishlist = true;
                wishlist.$loaded()
                    .then(function(list){
                        if(list.$value == null) {
                            wishlist.set("name", $rootScope.firebaseUser.displayName+"'s Wishlist");
                        }
                        wishlist.set("img", $rootScope.firebaseUser.photoURL);
                    });
            } else {
                takenFlags = $firebaseObject(firebase.database().ref().child("takenFlag/"+gid+"/"+uid));
            }

            return wishlist;
        }
    });