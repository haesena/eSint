/**
 * Created by haesen on 12.10.2016.
 */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBX-NnuP-jopNKyF4-xqxpQLLsBnjsb-aw",
    authDomain: "esint-e6f08.firebaseapp.com",
    databaseURL: "https://esint-e6f08.firebaseio.com",
    storageBucket: "esint-e6f08.appspot.com",
    messagingSenderId: "689592537822"
};
firebase.initializeApp(config);

angular.module("eSint", ["firebase", "ngMaterial", "ui.router", "ngMessages"]);

angular
    .module('eSint')
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('red', {
                'default': '400', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
            // If you specify less than all of the keys, it will inherit from the
            // default shades
            .accentPalette('purple', {
                'default': '200' // use shade 200 for default, and keep all other shades the same
            });

    });