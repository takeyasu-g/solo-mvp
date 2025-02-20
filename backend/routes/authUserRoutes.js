const express = require('express');
const admin = require('../firebase');
const knex = require('../knex');
const router = express.Router();
const { verifyToken } = require('../utils/authMiddleware');

// SIGN UP route
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ error: 'Email, password, and username are required' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    const userRecord = await admin.auth().createUser({ email, password });

    await knex('users').insert({
      firebase_uid: userRecord.uid,
      email: userRecord.email,
      username,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ error: 'Email is already in use.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    console.log('Attempting to log in:', email);

    // Use Firebase Admin SDK to verify the user's credentials
    const userRecord = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    console.log('Login successful:', email); // Log successful login
    res.status(200).json({ customToken }); // Send custom token to frontend
  } catch (error) {
    console.error('Login failed:', error.message); // Log login failure
    res.status(400).json({ error: error.message });
  }
});

// GET profile of user (from tokenId firebase Uid)
router.get('/profile', verifyToken, async (req, res) => {
  const { user } = req;

  try {
    const dbUser = await knex('users')
      .where({ firebase_uid: user.uid })
      .first();

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in the database' });
    }

    res.status(200).json({ username: dbUser.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
