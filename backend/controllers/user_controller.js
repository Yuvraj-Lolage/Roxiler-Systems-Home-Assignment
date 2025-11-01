const jwt = require('jsonwebtoken');
const db = require('../config/db');
const bcrypt = require("bcrypt");
const { User } = require('../models/user');
const { authenticationMiddleware, generateToken } = require('../middleware/jwt')

const userSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create(name, email, password);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findByEmail(email);

        if (existingUser != null) {
            if (existingUser.password != password) {
                return res.status(401).json({ message: "Invalid email or password" });
            } else {
                const payload = {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role
                };

                const token = generateToken(payload);
                return res.status(200).json({
                    "token": token
                });
            }
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required" });
    }

    const [user] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user[0].password !== oldPassword) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    await db.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, userId]);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { userSignUp, userLogin, changePassword };