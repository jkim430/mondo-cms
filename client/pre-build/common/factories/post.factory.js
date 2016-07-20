app.factory('PostFactory', function($http, AuthService, UserFactory) {
    return {
        getPosts: function() {
            return AuthService.getLoggedInUser()
                .then(function(user) {
                    return $http.get('/api/posts/all/' + user._id)
                })
                .then(function(res) {
                    return res.data
                })
        },
        submitPost: function(post) {
            post.author = UserFactory.currentUser._id;
            return $http.post('/api/posts', post)
                .then(function(res) {
                    var newPost = res.data;
                    newPost.author = UserFactory.currentUser;
                    return newPost;
                })
        },
        updatePost: function(post) {
            return $http.put('/api/posts/' + post._id, post)
                .then(function(res) {
                    return res.data;
                })
        },
        deletePost: function(id) {
            return $http.delete('/api/posts/' + id);
        }
    };
});
