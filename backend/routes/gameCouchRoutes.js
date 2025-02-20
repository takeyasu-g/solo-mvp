const express = require('express');
const knex = require('../knex');
const { verifyToken } = require('../utils/authMiddleware');
const router = express.Router();

// CREATE a Game Couch event
router.post('/create', verifyToken, async (req, res) => {
  const {
    game_name,
    game_image,
    max_seats,
    event_time,
    location,
    title,
    description,
  } = req.body;

  // Check if required fields are missing
  if (!game_name || !max_seats || !event_time || !location) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Validate event_time is a valid date
  if (isNaN(Date.parse(event_time))) {
    return res.status(400).json({ error: 'Invalid event_time format.' });
  }

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
    console.error('Error creating Game Couch event:', error.message); // Log error
    res.status(500).json({ error: error.message });
  }
});

// JOIN a Game Couch Event (when player clicks a couch seat to join event)
router.post('/:id/join', async (req, res) => {
  const { player_name } = req.body; // input for name of player
  const gameCouchId = req.params.id; // game couch event id
  const token = req.headers.authorization?.split(' ')[1]; // gets token if there

  let playerUid = null; // start null if they don't have account
  let playerNameForGameCouchSeat = player_name;

  try {
    // Check if the Game Couch event exists
    const gameCouch = await knex('game_couch')
      .where({ id: gameCouchId })
      .first();
    if (!gameCouch) {
      return res.status(404).json({ error: 'Game Couch event not found.' });
    }

    // Check if the Game Couch is full
    const currentPlayers = await knex('game_couch_players')
      .where({ game_couch_id: gameCouchId })
      .count(); // count n of rows in game_couch_players where game_couch_id

    if (parseInt(currentPlayers[0].count) >= gameCouch.max_seats) {
      return res.status(400).json({ error: 'Game Couch is full.' });
    }

    // If a token exists, verify it and get the user's UID
    if (req.headers.authorization) {
      try {
        // need to wrap verfiyToken middleware in a promise since it doesn't return a value
        await new Promise((resolve, reject) => {
          verifyToken(req, res, (err) => {
            if (err) reject(err);
            resolve();
          });
        });

        playerUid = req.user.uid; // Store Firebase UID

        // Fetch username from database
        const user = await knex('users')
          .where({ firebase_uid: playerUid })
          .first();
        if (user) {
          playerNameForGameCouchSeat = user.username; // Use stored username to Game couch players name
        }
      } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    }

    // Add the player to the Game Couch
    const [playerId] = await knex('game_couch_players')
      .insert({
        game_couch_id: gameCouchId,
        player_name: playerNameForGameCouchSeat, // Automatically use username if logged in
        player_uid: playerUid, // Store UID if logged in, NULL for guests
      })
      .returning('id');

    // Send success response
    res.status(201).json({
      message: 'Player joined successfully!',
      player_id: playerId, // game_couch_players.id
      player_name: playerNameForGameCouchSeat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all players in the game couch event
router.get('/:id/players', async (req, res) => {
  try {
    // game couch ID from request params
    const gameCouchId = req.params.id;

    // query database to get players for this Game Couch event
    const players = await knex('game_couch_players')
      .select('player_name')
      .where('game_couch_id', gameCouchId);

    // return the list of players names as []
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

module.exports = router;
