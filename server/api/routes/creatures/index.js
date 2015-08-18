'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var Creature = mongoose.model('Creature');
var router = require('express').Router();
module.exports = router;

// /api/creatures
router.param('id', function(req, res, next, id) {
    Creature.findById(id).exec()
        .then(function(creature) {
            if (creature) {
                req.creature = creature;
                next();
            } else {
                throw new Error("Creature doesn't exist!");
            }
        })
        .then(null, next);
});

router.get('/', function(req, res, next) {
    Creature.find().exec()
        .then(function(creatures) {
            res.json(creatures);
        })
        .then(null, next);
});

router.post('/', function(req, res, next) {
    Creature.create(req.body)
        .then(function(creature) {
            res.status(201).json(creature);
        })
        .then(null, next);
});

router.get('/:id', function(req, res, next) {
    res.json(req.creature);
});

router.put('/:id', function(req, res, next) {
    _.extend(req.creature, req.body);
    req.creature.save()
        .then(function(creature) {
            res.status(200).json(creature);
        })
        .then(null, next);
});

router.delete('/:id', function(req, res, next) {
    req.creature.remove()
        .then(function() {
            res.status(200).json({
                message: 'Successfully deleted!'
            });
        })
        .then(null, next);
});