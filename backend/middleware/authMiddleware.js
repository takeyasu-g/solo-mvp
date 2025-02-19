const admin = require('../firebase');

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

    // attach decoded user information(like the UID) to the request.user (so next route can use it)
    req.user = decodedToken;

    next(); // call next route (which should be profile)
  } catch (error) {
    // If token verification fails
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
