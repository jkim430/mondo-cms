var Promise = require('bluebird');
var chalk = require('chalk');
var dbName = "mondo";
var env = require('./env');

var DATABASE_URI = env.DATABASE_URI;

var mongoose = require('mongoose');
var db = mongoose.connect(DATABASE_URI).connection;

require('./db/models');

var startDbPromise = new Promise(function(resolve, reject) {
    db.on('open', resolve);
    db.on('error', reject);
});


console.log('Starting MongoDB...');

startDbPromise.then(function() {
    console.log(chalk.green('MongoDB connection opened! dbName:'), chalk.magenta(dbName));
});


module.exports = startDbPromise;
