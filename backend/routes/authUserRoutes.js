const express = require('express');
const admin = require('../firebase');
const knex = require('../knex');
const router = express.Router();

// sign up route
router.post('/signup', async (req, res) => {
  //get email and password inputs from req.body
  const { email, password, username } = req.body;

  // check if email and password are in the request before calling
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if password is at least 6 characters long
  if (password.length < 6) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters long.',
    });
  }

  try {
    // Check if username is already taken in database
    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    // creates user in firebase, using only email and password (from request body)
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // insert new user into database and not returning any information from database
    await knex('users').insert({
      firebase_uid: userRecord.uid,
      email: userRecord.email,
      username,
    });

    res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    // if email aready exists ( check error code  from firebase)
    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({
        error: 'Email is already in use.',
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// middleware to verify token fron firebase
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // extract just the token Id

  // if no token is provided
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    // verify token in firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // attach decoded user information to the request.user (so next route can use it)
    req.user = decodedToken;

    next(); // call next route (which should be profile)
  } catch (error) {
    // If token verification fails
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// GET profile of user (from tokenId firebase Uid)
router.get('/profile', verifyToken, async (req, res) => {
  const { user } = req; // Get user information from verifyToken middleware

  // Now, fetch the user from the database using the firebase_uid
  try {
    const dbUser = await knex('users')
      .where({ firebase_uid: user.uid })
      .first();

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in the database' });
    }

    // Return the user's profile data
    // for now only return username
    res.status(200).json({ username: dbUser.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
