// routes/ratingRoutes.js
const express = require("express");
const { submitRating, getStoreDetailsAndAvgRating } = require("../controllers/ratings_controller");
const authenticate = require("../middleware/authenticate");
const { default: verifyStoreOwner } = require("../middleware/verifyStoreOwner");
const ratingRouter = express.Router();

ratingRouter.post("/",authenticate, submitRating);
ratingRouter.get("/store/ratings", verifyStoreOwner ,getStoreDetailsAndAvgRating)

module.exports = { ratingRouter }
