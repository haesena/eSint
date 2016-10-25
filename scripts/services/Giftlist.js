/**
 * Created by haesen on 23.10.2016.
 */
angular
    .module("eSint")
    .factory('Giftlist', function ($firebaseObject, $firebaseArray, $firebase, $timeout, $rootScope) {

        var _gid;
        var $theScope;

        var Giftlist = $firebaseObject.$extend({
            empty: function() {
                return this.$value === null;
            },

            set: function(path, value) {
                var myRef = this.$ref();
                myRef.child(path).set(value);
            },

        });

        return function(gid, $scope) {
            $theScope = $scope;
            _gid = gid;
            var uid = $rootScope.firebaseUser.uid;

            var ref = firebase.database().ref().child("gifts/"+gid+"/"+uid);
            var giftlist = new Giftlist(ref);

            // if(uid == $rootScope.firebaseUser.uid) {
            //     myWishlist = true;
            //     wishlist.$loaded()
            //         .then(function(list){
            //             if(list.$value == null) {
            //                 wishlist.set("name", $rootScope.firebaseUser.displayName+"'s Wishlist");
            //             }
            //             wishlist.set("img", $rootScope.firebaseUser.photoURL);
            //         });
            // } else {
            //     takenFlags = $firebaseObject(firebase.database().ref().child("takenFlag/"+gid+"/"+uid));
            // }

            return giftlist;
        }
    });