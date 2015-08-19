'use strict';

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var worldSchema = new mongoose.Schema({
    name: String,
    tick: {
        type: Number,
        default: 10
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    size: {
        type: Number,
        default: 100
    },
    map: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Cell'
    }],
    // materials: [{
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Material'
    // }],
    environment: { // set materials on front end depending on env
        type: String,
        default: 'land'
    }, //air, aquatic, tundra
    temperature: Number,
    trees: String
});

worldSchema.plugin(deepPopulate, {});

worldSchema.pre('save', function(next) {
    this.timestamp = Date.now();
    next();
});

mongoose.model('World', worldSchema);