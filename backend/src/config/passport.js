const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const { id, displayName, emails } = profile;

      // Check if user exists
      const result = await pool.query(
        'SELECT * FROM users WHERE oauth_id = $1',
        [id]
      );

      let user = result.rows[0];

      if (!user) {
        // Insert new user if not found
        const insertResult = await pool.query(
          `INSERT INTO users (oauth_provider, oauth_id, name, email)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          ['google', id, displayName, emails[0].value]
        );
        user = insertResult.rows[0];
      }

      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err, null);
    }
  }
));

// Save user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Get user details from session ID
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});
