// routes/ratingRoutes.js
const express = require("express");
const { submitRating, getStoreDetailsAndAvgRating } = require("../controllers/ratings_controller");
const authenticate = require("../middleware/authenticate");
const verifyStoreOwner = require("../middleware/verifyStoreOwner");
const { createRateLimiter } = require("../middleware/rate_limiter");
const ratingRouter = express.Router();

const ratingWriteLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many rating submissions. Please wait a bit before trying again.",
});

const ratingReadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: "Too many rating requests. Please try again shortly.",
});

ratingRouter.post("/", authenticate, ratingWriteLimiter, submitRating);
ratingRouter.get("/store/ratings", verifyStoreOwner, ratingReadLimiter, getStoreDetailsAndAvgRating);

module.exports = { ratingRouter };
