require('dotenv').config();
const express = require('express');
const authUserRoutes = require('./routes/authUserRoutes'); // routes for authentication (sign in / sign up)

const app = express();

const PORT = process.env.PORT || 8080;

// parse incoming JSON requests
app.use(express.json());

// use AuthUserRoutes
// endpoints with /auth will go to authUserRoutes
app.use('/auth', authUserRoutes);

// basic endpoint (test) => to be changed to static file
app.get('/', (req, res) => {
  res.send('server is running');
});

//start server on PORT
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
