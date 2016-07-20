'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var router = require('express').Router();
module.exports = router;

// /api/posts
router.param('id', function(req, res, next, id) {
    Post.findById(id).populate('author').exec()
        .then(function(post) {
            if (post) {
                req.post = post;
                next();
            } else {
                throw new Error("Post doesn't exist!");
            }
        })
        .then(null, next);
});

router.param('userId', function(req, res, next, id) {
    User.findById(id).exec()
        .then(function(user) {
            if (user) {
                req.user = user;
                next();
            } else {
                throw new Error("User doesn't exist!");
            }
        })
        .then(null, next);
});


router.get('/all/:userId', function(req, res, next) {
    if (req.user.isAdmin) {
        Post.find().populate('author').exec()
            .then(function(posts) {
                res.json(posts);
            })
            .then(null, next);
    } else {
        Post.find({author: req.user._id}).populate('author').exec()
            .then(function(posts) {
                res.json(posts);
            })
            .then(null, next);
    }
});

router.post('/', function(req, res, next) {
    Post.create(req.body)
        .then(function(post) {
            res.status(201).json(post);
        })
        .then(null, next);
});

router.put('/:id', function(req, res, next) {
    _.extend(req.post, req.body);
    req.post.save()
        .then(function(post) {
            res.status(200).json(post);
        })
        .then(null, next);
});

router.delete('/:id', function(req, res, next) {
    Post.remove({
        _id: req.params.id
    })
        .then(function() {
            res.status(200).json({
                message: 'Successfully deleted!'
            });
        })
        .then(null, next);
});
