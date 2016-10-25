/**
 * Created by haesen on 12.10.2016.
 */

angular
    .module("eSint")
    .run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $state.go("home");
        }
    });
}]);

angular
    .module("eSint")
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state("home", {
                url: '/home?invite',
                controller  : 'mainController',
                templateUrl : 'views/home.html',
                resolve: {
                    "currentAuth": ["Auth", function(Auth) {
                        return Auth.$waitForSignIn();
                    }]
                }
            })
            .state("groups", {
                name: 'groups',
                url: '/groups/{action}?gid',
                controller  : 'groupController',
                templateUrl : 'views/groups.html',
                resolve: {
                    "currentAuth": ["Auth", function(Auth) {
                        return Auth.$requireSignIn();
                    }],
                }
            })
            .state("invite", {
                name: 'groups',
                url: '/invite/{inviteId}',
                controller  : 'mainController',
                templateUrl : 'views/home.html',
                resolve: {
                    inviteId: function($stateParams, $rootScope) {
                        $rootScope.inviteId = $stateParams.inviteId;
                        return $stateParams.inviteId;
                    }
                }
            })
            .state("myWishlist", {
                name: 'myWishlist',
                url: '/myWishlist',
                controller  : 'wishesController',
                templateUrl : 'views/wishes.html',
                resolve: {
                    "currentAuth": ["Auth", function(Auth) {
                        return Auth.$requireSignIn();
                    }],
                }
            })
            .state("wishlist", {
                name: 'wishlist',
                url: '/wishlist/{user}',
                controller  : 'wishlistController',
                templateUrl : 'views/wishlist.html',
                resolve: {
                    "currentAuth": ["Auth", function(Auth) {
                        return Auth.$requireSignIn();
                    }]
                }
            })
            .state("gifts", {
                name: 'gifts',
                url: '/gifts',
                controller  : 'giftsController',
                templateUrl : 'views/gifts.html',
                resolve: {
                    "currentAuth": ["Auth", function(Auth) {
                        return Auth.$requireSignIn();
                    }]
                }
            });

}]);
