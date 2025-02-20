require('dotenv').config();
const express = require('express');
const authUserRoutes = require('./routes/authUserRoutes'); // routes for authentication (sign in / sign up)
const gameCouchRoutes = require('./routes/gameCouchRoutes'); // routes for gameCouch (event maker)
const igdbRoutes = require('./routes/igdbRoutes'); // routes for IGDB API (fetch games)

const app = express();

const PORT = process.env.PORT || 8080;

// parse incoming JSON requests
app.use(express.json());

// use AuthUserRoutes
app.use('/api/auth', authUserRoutes);

// use gameCouchRoutes
app.use('/api/game-couch', gameCouchRoutes);

// use IGDBApiRoutes
app.use('/api/igdb', igdbRoutes);

// basic endpoint (test) => to be changed to static file
// should this be in front of other endpoints?
app.get('/', (req, res) => {
  res.send('server is running');
});

//start server on PORT
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
