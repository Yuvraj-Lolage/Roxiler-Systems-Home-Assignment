const express = require('express');
const statRouter = express.Router();
const verifyAdmin = require('../middleware/verifyadmin');
const { getAdminStatisticsData, getUsers, getStores } = require('../controllers/stats_controller');

statRouter.get('/stats', verifyAdmin , getAdminStatisticsData);
statRouter.get('/users',verifyAdmin, getUsers);
statRouter.get('/stores', verifyAdmin, getStores)

module.exports = statRouter;