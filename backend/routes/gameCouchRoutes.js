const express = require('express');
const knex = require('../knex');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a Game Couch event
router.post('/', verifyToken, async (req, res) => {
  const {
    game_name,
    game_image,
    max_seats,
    event_time,
    location,
    title,
    description,
  } = req.body;

  try {
    // Fetch the user's details from the database (with tokenid)
    const user = await knex('users')
      .where({ firebase_uid: req.user.uid })
      .first();
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Generate default title ("Friday Game Couch") if not provided
    const dayOfWeek = new Date(event_time).toLocaleDateString('en-US', {
      weekday: 'long',
    });
    const generatedTitle = title || `${dayOfWeek} Game Couch`;

    // Insert the new Game Couch event
    const [gameCouchId] = await knex('game_couch') // destructure the array
      .insert({
        host_id: user.id,
        host_username: user.username,
        game_name,
        game_image,
        max_seats,
        event_time,
        location,
        title: generatedTitle,
        description,
      })
      .returning('id'); // returning only game_couch.id (primary key)

    // send back game couch event so we can display it
    res.status(201).json({
      message: 'Game Couch event created successfully!',
      game_couch_id: gameCouchId,
      host_username: user.username,
      game_name,
      game_image,
      max_seats,
      event_time,
      location,
      title: generatedTitle,
      description,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
