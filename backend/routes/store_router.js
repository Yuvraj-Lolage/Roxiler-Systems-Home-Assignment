const express = require('express');
const { getAllStores } = require('../controllers/store_controller');
const storeRouter = express.Router();

storeRouter.get('/all', getAllStores)

module.exports = { storeRouter };