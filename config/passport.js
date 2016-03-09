var GoogleStrategy = require('passport-google-oauth20').Strategy;

var User = require('../models/user');

var configAuth = require('./auth');

module.exports = function(passport, ysm) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, '-categories', function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({'google.id': profile.id}, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    // don't do anything
                } else {
                    // create a new user
                    user = new User();

                    user.google.id = profile.id;
                    user.google.name = profile.displayName;
                    //user.google.email = profile.emails[0].value;
                    user.google.picture = profile.photos[0].value;

                    console.log(user);
                }

                // save user
                user.google.accessToken = accessToken;
                user.google.refreshToken = refreshToken;
                user.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    ysm.setAuthClient(accessToken, refreshToken);
                    return done(null, user);
                });
            });
        });
    }));
};
