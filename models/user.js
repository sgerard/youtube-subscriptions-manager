var mongoose = require('mongoose')

var Category = require('../models/category');

var userSchema = mongoose.Schema({
    google: {
        id: String,
        accessToken: String,
        refreshToken: String,
        name: String,
        picture: String
    }
});

module.exports = mongoose.model('User', userSchema);
