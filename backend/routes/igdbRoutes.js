const express = require('express');
const router = express.Router();
const fetchIGDBGames = require('../utils/fetchIGDBGames'); // Import IGDB game fetcher

// GET Games from IGDB with Filters
// NEEDS querys in the endpoint for filters
router.get('/games', async (req, res) => {
  try {
    // Extract filters from query params (follow this code to help for frontend)
    // this might not be the best way to do this (TO DO: refactor?)
    const filters = {
      search: req.query.search ? req.query.search : null,
      offset: req.query.offset ? parseInt(req.query.offset) : 0, // default offset 0
      new: req.query.new === 'true',
      topRating: req.query.topRating === 'true',
      maxPlayers: req.query.maxPlayers ? parseInt(req.query.maxPlayers) : null,
      genre: req.query.genre ? req.query.genre : null,
      platform: req.query.platform ? parseInt(req.query.platform) : null,
      keywords: req.query.keywords ? req.query.keywords : null, // current not so useful ( only for remove games with 18+ keyword)
    };

    // Fetch games from IGDB with applied filters
    const games = await fetchIGDBGames(filters);

    if (!games) {
      return res.status(500).json({ error: 'Failed to fetch games from IGDB' });
    }

    res.json(games); // Send games to frontend
  } catch (error) {
    console.error('Error fetching IGDB games:', error);
    res.status(500).json({ error: 'Server error fetching games' });
  }
});

module.exports = router;
