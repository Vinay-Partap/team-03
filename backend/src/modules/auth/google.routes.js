const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authService = require('./auth.service');
const router = express.Router();

passport.use(new GoogleStrategy({ clientID: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, callbackURL: process.env.GOOGLE_CALLBACK_URL }, (_accessToken, _refreshToken, profile, done) => done(null, profile)));
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?oauth=failed` }), async (req, res) => {
  try {
    const tokens = await authService.loginWithGoogle(req.user);
    const query = new URLSearchParams({ token: tokens.token, refreshToken: tokens.refreshToken, user: JSON.stringify(tokens.user) });
    res.redirect(`${process.env.FRONTEND_URL}/oauth/callback?${query}`);
  } catch (_) { res.redirect(`${process.env.FRONTEND_URL}/login?oauth=failed`); }
});
module.exports = router;
