const express = require('express');
const passport = require('passport');
const session = require('express-session');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passportSetup = require('./passport-setup');
const authRoutes = require('./routes/auth');
const multer = require('multer');

const app = express();

app.use(express.json());
app.use(bodyParser.json());

const generateSessionSecret = () => {
    return crypto.randomBytes(32).toString('hex');
};

const sessionSecret = generateSessionSecret();
// console.log('Session Secret:', sessionSecret);

app.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
}));

mongoose.connect('mongodb://127.0.0.1:27017/skintales')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });


const User = require('./model/user');
const Post = require('./model/post');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const uploadRoutes = require('./routes/upload');


app.use(userRoutes);
app.use(postRoutes);
app.use(uploadRoutes);

app.use(passport.initialize());
app.use(passport.session());

passportSetup(passport);

//google oauth route
app.get(
    "/auth/google",
    passport.authenticate("google", {
        successRedirect: "/welcomeOauth", // Redirect to a success page
        failureRedirect: "/error", // Redirect to the home page or login page on failure
    })
);

// Handle the Google OAuth callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  (req, res) => {
    // Successful authentication, redirect to the welcome page or your desired route
    res.redirect('/welcomeOauth');
  }
);

// Handle the success redirect route
app.get('/welcomeOauth', (req, res) => {
  res.send('Welcome! Google OAuth login successful.');
});

// Handle the failure redirect route
app.get('/error', (req, res) => {
  res.send('Oops! Something went wrong with Google OAuth login.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
