const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const slugify = require('slugify');

// const { GOOGLE_CONFIG, FACEBOOK_CONFIG } = require('../config/config');
const User = require('../models/User');

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = function (passport) {
    passport.serializeUser((user, done) => done(null, {
        id: user.id,
        _socket: user._socket
    }));

    passport.deserializeUser((user, done) => {
        User.findByPk(user.id, {
                attributes: {
                    exclude: ['password']
                }
            })
            // .select('-password -googleId -facebookId')
            .then(user => {
                done(null, {
                    details: user,
                    _socket: user._socket
                });
            });
    });

    passport.use(
        new JwtStrategy(opts, (payload, done) => {
            User.findByPk(payload.id, {
                    attributes: {
                        exclude: ['password']
                    }
                })
                // .select('-password')
                .then(user => {
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
        })
    );

};