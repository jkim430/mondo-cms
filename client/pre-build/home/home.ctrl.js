app.controller('HomeController', function($rootScope, $state, $scope, $modal, $log, AuthService, UserFactory) {

    $scope.login = function() {
        AuthService.login($scope.credentials).then(function() {
            return AuthService.getLoggedInUser();
        }).then(function(user) {
            UserFactory.currentUser = user;
            $state.go('posts');
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });
    };

    $scope.openSignup = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'sign.html',
            controller: 'SignupInstanceCtrl'
        });

        modalInstance.result.then(null, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
})

app.controller('SignupInstanceCtrl', function($scope, $state, $modalInstance, UserFactory, AuthService) {

    $scope.ok = function() {
        var credentials = {
            username: $scope.newUser.username,
            password: $scope.newUser.password
        };
        UserFactory.postUser($scope.newUser)
            .then(function(user) {
                UserFactory.currentUser = user;
                return AuthService.login(credentials)
            })
            .then(function() {
                $modalInstance.close();
                $state.go('creatures.select');
            })
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
