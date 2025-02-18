const express = require('express');
const admin = require('../firebase');
const knex = require('../knex');
const router = express.Router();

// sign up route
router.post('/signup', async (req, res) => {
  //get email and password inputs from req.body
  const { email, password } = req.body;

  // check if email and password are in the request before calling
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if password is at least 6 characters long
  if (password.length < 6) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters long.',
    });
  }

  try {
    // creates user in firebase, using only email and password (from request body)
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // insert new user into database and not returning any information from database
    await knex('users').insert({
      firebase_uid: userRecord.uid,
      email: userRecord.email,
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

// Check if user email exists, but not checking password ( not sure if I need this)
//does not login the user, just gives back user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    res.status(200).json({
      message: 'User found',
      user: user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
