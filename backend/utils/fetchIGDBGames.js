const fetchHelper = require('./fetchHelper');
const getIGDBToken = require('./getIGDBToken');

// fetchIGDBGames accepts filters or else default is given
const fetchIGDBGames = async (filters = {}) => {
  try {
    const token = await getIGDBToken(); // Get a valid IGDB token

    if (!token) {
      throw new Error('Failed to retrieve IGDB token');
    }

    // URL to fetch games data
    const url = 'https://api.igdb.com/v4/games';

    // TO DO: want to add popularity filter, better then ratings
    const urlPopularity = 'https://api.igdb.com/v4/popularity_primitives';

    // Base fields (we always request these)
    // query will change based on whats in the filter obj
    const fields = `fields name, total_rating, cover.image_id, first_release_date, genres.name, platforms.name, multiplayer_modes.onlinemax;`;

    // Modify Sorting Based on Filters
    let sortOrder = ' sort total_rating desc;'; // Default sorting (highest rated games)

    if (filters.new) sortOrder = 'sort first_release_date desc;'; // New releases and rating

    // Apply "Where" filters
    let whereFilters = []; // the "where" filters

    // total_rating higher then or equal to 90
    if (filters.topRating) whereFilters.push(`total_rating >= 90`);

    // max players
    if (filters.maxPlayers)
      whereFilters.push(
        `multiplayer_modes.onlinemax >= 2 & multiplayer_modes.onlinemax <= ${filters.maxPlayers}`
      );

    // e.g. Tactical (TO DO: is case sensitive)
    if (filters.genre) whereFilters.push(`genres.name = ("${filters.genre}")`);

    // platform e.g PC (TO DO: add and array of platforms)
    if (filters.platform)
      whereFilters.push(`platforms = (${filters.platform})`); // 6 = pc

    // rid of 18+ keywords (TO DO: only accpets 1 keyword)
    if (filters.keywords)
      whereFilters.push(`keywords.name != ("${filters.keywords}")`);

    // Build query parts in correct order
    let queryParts = [fields];

    if (filters.search) {
      queryParts.unshift(`search "${filters.search}";`);
    } else {
      queryParts.push(sortOrder);
    }

    if (whereFilters.length > 0) {
      queryParts.push(`where ${whereFilters.join(' & ')};`);
    }

    // limit (amount to query )and offset (start where in the query)
    queryParts.push(` limit 10; offset ${filters.offset};`);

    const query = queryParts.join(' '); // Combines to IGDB query string
    console.log(query);

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
