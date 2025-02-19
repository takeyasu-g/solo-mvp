const fetchHelper = async ({
  url,
  method = 'GET',
  headers = {},
  body = null,
}) => {
  try {
    // Convert body only if necessary
    if (body) {
      if (headers['Content-Type'] === 'application/json') {
        body = JSON.stringify(body); // Convert to JSON
      } else if (
        headers['Content-Type'] === 'application/x-www-form-urlencoded'
      ) {
        body = new URLSearchParams(body).toString(); // Convert to URL-encoded
      }
    } // add more content-types if needed

    const options = {
      method,
      headers,
      body,
    };

    if (method === 'GET' || !body) {
      delete options.body; // Remove body for GET requests
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} - ${data.message || 'Unknown error'}`
      );
    }

    return data;
  } catch (error) {
    console.error('Fetch Error:', error.message);
    return null;
  }
};

module.exports = fetchHelper;
