const express = require('express');
const statRouter = express.Router();
const verifyAdmin = require('../middleware/verifyadmin');
const { getAdminStatisticsData, getUsers, getStores } = require('../controllers/stats_controller');
const { createRateLimiter } = require("../middleware/rate_limiter");

const adminLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: "Too many admin requests. Please slow down and try again shortly.",
});

statRouter.get('/stats', verifyAdmin, adminLimiter, getAdminStatisticsData);
statRouter.get('/users', verifyAdmin, adminLimiter, getUsers);
statRouter.get('/stores', verifyAdmin, adminLimiter, getStores);

module.exports = statRouter;
