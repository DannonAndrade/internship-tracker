const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback URL
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
    successRedirect: 'http://localhost:5173/dashboard'
  })
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173');
  });
});

// Get current user info if authenticated
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router;
