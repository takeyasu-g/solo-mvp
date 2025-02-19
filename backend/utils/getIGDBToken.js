require('dotenv').config(); // to get the TWITCH API keys
const fetchHelper = require('./fetchHelper');

let cachedToken = null; // store Oauth token
let tokenExpiration = null; // store expiration time in milliseconds

const getIGDBToken = async () => {
  // check if token is still valid (not expired)
  if (cachedToken && Date.now() < tokenExpiration) {
    return cachedToken;
  }

  // if expired , fetch new token
  const url = `https://id.twitch.tv/oauth2/token`;

  // request body
  const body = {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: 'client_credentials',
  };

  // Send request (POST), using fetchHelper
  try {
    const data = await fetchHelper({
      url,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    // checking valid token
    if (data && data.access_token) {
      cachedToken = data.access_token;
      tokenExpiration = Date.now() + data.expires_in * 1000; // add the milliseconds it expires to date now

      return cachedToken;
    }

    return null;
  } catch (error) {
    console.error('Error fetching IGDB token:', error);
    return null;
  }
};

module.exports = getIGDBToken;
