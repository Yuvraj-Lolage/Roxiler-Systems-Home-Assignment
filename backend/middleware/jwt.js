const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "24h",
  });
};

module.exports = { generateToken };
