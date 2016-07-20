var app = angular.module('MondoBlog', ['ui.router', 'fsaPreBuilt', 'ui.bootstrap']);

app.config(function($urlRouterProvider, $locationProvider, $stateProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // $routeProvider.when('/builder/',{templateUrl:'/builder/builder.html'});
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});

// This app.run is for controlling access to specific states.
app.run(function($rootScope, AuthService, $state, UserFactory) {
    AuthService.getLoggedInUser().then(function(user) {
        if (!user) throw 'No user';
        return UserFactory.getUser(user._id)
    })
        .then(function(user) {
            UserFactory.currentUser = user;
        })
        .catch(function(err) {
            console.log(err)
        })
    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.fromState = fromState
        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function(user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('home');
            }
        });


    });

});

app.config(function($stateProvider) {
    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/pre-build/home/home.html',
        controller: 'HomeController'
    })
    .state('posts', {
        url: '/posts',
        templateUrl: '/pre-build/posts/posts.html',
        controller: 'PostsCtrl',
        data: {
            authenticate: true
        },
        resolve: {
            posts: function(PostFactory) {
                return PostFactory.getPosts();
            }
        }
    });
});
