var mongoose = require('mongoose');
var startDb = require('./server/db');
var Promise = require('bluebird');
var chalk = require('chalk');

// Models
var User = mongoose.model('User');

var user = new User({
    name: {
        first: 'Mondo',
        last: 'Labs'
    },
    username: 'admin',
    password: 'mondorox',
    isAdmin: true
});

startDb.then(function() {
    return User.find().remove()
})
    .then(function() {
        return User.create(user);
    })
    .then(function() {
        console.log(chalk.green('Database seeded. Goodbye!'));
        process.exit(0);
    });
