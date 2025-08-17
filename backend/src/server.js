const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const pool = require('./config/db');
const applicationRoutes = require('./routes/applicationRoutes');

require('dotenv').config();
require('./config/passport'); // We'll create this soon

const app = express();

// Enable CORS for your frontend (adjust origin if needed)
app.use(cors({
  origin: 'http://localhost:5173',  // change this to your frontend port
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());

// Session store in Postgres
app.use(session({
  store: new pgSession({
    pool: pool,                // Connection pool
    tableName: 'session'       // Use default "session" table
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to true if using HTTPS
}));

// Initialize Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));
app.use('/api/applications', applicationRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
