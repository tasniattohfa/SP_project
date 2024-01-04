const express = require('express');
const passport = require('passport');
const router = express.Router();

// Handle the Google OAuth callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  (req, res) => {
    // Successful authentication, redirect to the welcome page or your desired route
    res.redirect('/welcomeOauth');
  }
);

// Handle the success redirect route
router.get('/welcomeOauth', (req, res) => {
  res.send('Welcome! Google OAuth login successful.');
});

// Handle the failure redirect route
router.get('/error', (req, res) => {
  res.send('Oops! Something went wrong with Google OAuth login.');
});

module.exports = router;
