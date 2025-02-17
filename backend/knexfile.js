require('dotenv').config();

// if in production DB_URL will be the configs to use, else use .env variables.
module.exports = {
  client: 'pg',
  connection: process.env.DB_URL || {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },

};
