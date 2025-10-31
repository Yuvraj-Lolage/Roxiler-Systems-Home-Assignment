const AdminStats = require("../models/admin");
const { User } = require('../models/user');
const { Store } = require("../models/store");

const getAdminStatisticsData = async (req, res) => {
  try {
    // If getAdminStats doesn't require userId/storeId, call it without parameters
    const data = await AdminStats.getAdminStats();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};


const getUsers = async (req, res) => {
  try {
    const usersData = await User.findAll();
    res.status(200).json(usersData);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};


const getStores = async (req, res) => {
  try {
    const storeData = await Store.findAll();
    res.status(200).json(storeData);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
}

module.exports = {
  getAdminStatisticsData,
  getStores,
  getUsers
};
