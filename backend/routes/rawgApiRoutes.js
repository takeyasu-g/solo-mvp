const express = require('express');
require('dotenv').config();

const router = express.Router();

const RAWG_API_KEY = process.env.RAWG_API_KEY; // Get API key from .env

module.exports = router;
