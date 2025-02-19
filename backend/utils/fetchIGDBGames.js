const fetchHelper = require('./fetchHelper');
const getIGDBToken = require('./getIGDBToken');

// fetchIGDBGames accepts filters or else default is given
const fetchIGDBGames = async (filters = {}) => {
  try {
    const token = await getIGDBToken(); // Get a valid IGDB token

    if (!token) {
      throw new Error('Failed to retrieve IGDB token');
    }

    const url = 'https://api.igdb.com/v4/games';

    // Base fields (we always request these)
    // query will change based on whats in the filter obj
    const fields =
      'fields name, popularity, cover.image_id, first_release_date;';
    let sortOrder = 'sort popularity desc;'; // Default sorting (popular games)
    let whereFilters = []; // the "where" filters

    // Modify Sorting Based on Filters
    if (filters.trending) sortOrder = 'sort total_rating_count desc;'; // Trending games
    if (filters.new) sortOrder = 'sort first_release_date desc;'; // New releases

    // Apply "Where" filters
    if (filters.maxPlayers)
      whereFilters.push(
        `multiplayer_modes.max_players <= ${filters.maxPlayers}`
      );
    if (filters.genre) whereFilters.push(`genres = (${filters.genre})`);
    if (filters.platform)
      whereFilters.push(`platforms = (${filters.platform})`);

    // putting it together !
    let queryParts = [fields, sortOrder, 'limit 10;'];
    if (whereFilters.length > 0)
      queryParts.push(`where ${whereFilters.join(' & ')};`);

    const query = queryParts.join(' '); // Combines to IGDB query string

    const games = await fetchHelper({
      url,
      method: 'POST',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: query,
    });

    return games;
  } catch (error) {
    console.error('Error fetching IGDB games:', error);
    return null;
  }
};

module.exports = fetchIGDBGames;
