const express = require('express');
const { getAllStores } = require('../controllers/store_controller');
const storeRouter = express.Router();
const { createRateLimiter } = require("../middleware/rate_limiter");

const storeReadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 180,
  message: "Too many store requests. Please try again shortly.",
});

storeRouter.get('/all', storeReadLimiter, getAllStores);

module.exports = { storeRouter };
