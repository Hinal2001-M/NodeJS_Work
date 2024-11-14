const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const InstagramStrategy = require('passport-instagram');
const routes = require('./route');
const config = require('./config');

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.use(new InstagramStrategy({
    clientID: config.instagramAuth.clientID,
    clientSecret: config.instagramAuth.clientSecret,
    callbackURL: config.instagramAuth.callbackURL,

}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

app.use('/', routes);
const port = 3000;

app.listen(port, () => {
    console.log('app listen on port' + port);
});