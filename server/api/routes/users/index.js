'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model('User');
var router = require('express').Router();
module.exports = router;

// /api/users
router.param('id', function(req, res, next, id) {
    User.findById(id).exec()
        .then(function(user) {
            if (user) {
                req.CurrentUser = user;
                next();
            } else {
                throw new Error("User doesn't exist!");
            }
        })
        .then(null, next);
});

router.get('/:id', function(req, res, next) {
    res.json(req.CurrentUser);
});

router.post('/', function(req, res, next) {
    console.log('body', req.body);
    User.create(req.body)
        .then(function(user) {
            res.status(201).json(user);
        })
        .then(null, function(err) {
            console.log(err);
        });
});


