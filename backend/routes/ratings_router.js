// routes/ratingRoutes.js
const express = require("express");
const { submitRating } = require("../controllers/ratings_controller");
const authenticate = require("../middleware/authenticate");
const ratingRouter = express.Router();

ratingRouter.post("/",authenticate, submitRating);

module.exports = { ratingRouter }
