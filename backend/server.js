require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const authUserRoutes = require('./routes/authUserRoutes'); // routes for authentication (sign in / sign up)
const gameCouchRoutes = require('./routes/gameCouchRoutes'); // routes for gameCouch (event maker)
const igdbRoutes = require('./routes/igdbRoutes'); // routes for IGDB API (fetch games)

const app = express();

const PORT = process.env.PORT || 8080;

// parse incoming JSON requests
app.use(express.json());
app.use(cookieParser());

// configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // use a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set to true in production
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    },
  })
);

// use AuthUserRoutes
app.use('/api/auth', authUserRoutes);

// use gameCouchRoutes
app.use('/api/game-couch', gameCouchRoutes);

// use IGDBApiRoutes
app.use('/api/igdb', igdbRoutes);

// Serve static files from the frontend's dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Serve the index.html file for any unknown routes (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

//start server on PORT
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
