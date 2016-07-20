app.controller('PostsCtrl', function($scope, $state, $modal, $log, posts, PostFactory, AuthService) {
    $scope.posts = posts;

    $scope.openPost = function(post, index) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'post.html',
            controller: 'NewPostCtrl',
            size: 'lg',
            resolve: {
                post: function() {
                    return post;
                }
            }
        });

        modalInstance.result.then(function(postResult) {
            console.log("after modal close", postResult, index);
            if (index || index === 0) {
                $scope.posts[index] = postResult;
            } else {
                $scope.posts.push(postResult);
            }
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.deletePost = function(post, index) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'delete.html',
            controller: 'NewPostCtrl',
            size: 'sm',
            resolve: {
                post: function() {
                    return post;
                }
            }
        });

        modalInstance.result.then(function() {
            $scope.posts.splice(index, 1);
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.logOut = function() {
        AuthService.logout().then(function() {
            $state.go('home');
        });
    };

})

app.controller('NewPostCtrl', function($scope, $state, $modalInstance, PostFactory, AuthService, post) {

    if (post) {
        $scope.post = {
            _id: post._id,
            title: post.title,
            body: post.body
        };
    }

    $scope.submitPost = function() {
        if ($scope.post._id) {
            PostFactory.updatePost($scope.post)
                .then(function(post) {
                    $modalInstance.close(post);
                });
        } else {
            PostFactory.submitPost($scope.post)
                .then(function(post) {
                    $modalInstance.close(post);
                })
        }
    };

    $scope.delete = function() {
        PostFactory.deletePost(post._id)
            .then(function() {
                $modalInstance.close();
            });

    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

