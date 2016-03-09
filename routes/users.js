var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/services/youtube');
});

router.get('/auth', passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/youtube.readonly']
}));

router.get('/authcallback',
    passport.authenticate('google', {
        successRedirect: '/services/youtube',
        failureRedirect: '/services/youtube'
    })
);

module.exports = router;
