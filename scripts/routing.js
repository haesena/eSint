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
                url: '/home',
                controller  : 'mainController',
                templateUrl : 'views/home.html',
                resolve: {
                    // controller will not be loaded until $waitForSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the factory below
                    "currentAuth": ["Auth", function(Auth) {
                        // $waitForSignIn returns a promise so the resolve waits for it to complete
                        return Auth.$waitForSignIn();
                    }]
                }
            })
            .state("about", {
                name: 'about',
                url: '/about',
                controller  : 'aboutController',
                templateUrl : 'views/about.html',
                resolve: {
                    // controller will not be loaded until $requireSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the factory below
                    "currentAuth": ["Auth", function(Auth) {
                        // $requireSignIn returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireSignIn();
                    }]
                }
            })
            .state("contact", {
                name: 'contact',
                url: '/contact',
                controller  : 'contactController',
                templateUrl : 'views/contact.html',
                resolve: {
                    // controller will not be loaded until $requireSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the factory below
                    "currentAuth": ["Auth", function(Auth) {
                        // $requireSignIn returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireSignIn();
                    }]
                }
            })
            .state("groups", {
                name: 'groups',
                url: '/groups/{action}?gid',
                controller  : 'groupController',
                templateUrl : 'views/groups.html',
                resolve: {
                    // controller will not be loaded until $requireSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the factory below
                    "currentAuth": ["Auth", function(Auth) {
                        // $requireSignIn returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireSignIn();
                    }],
                }
            })
            .state("invite", {
                name: 'groups',
                url: '/invite/{inviteId}',
                controller  : 'mainController',
                templateUrl : 'views/home.html',
            });

}]);
