const passport = require('passport');
const express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('pages/index.ejs');
});

router.get('/profile', isLoggedIn, function (req, res) {
    res.render('pages/profile.ejs', {
        user: req.user
    });
});

router.get('/error', isLoggedIn, function (req, res) {
    res.render('pages/error.ejs');
});

router.get('/auth/instagram', passport.authenticate('instagram', {
    scope: ['public_profile', 'email']
}));

router.get('/auth/instagram/callback',
    passport.authenticate('instagram', {
        successRedirect: '/profile',
        failureRedirect: '/error'
    }));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = router;