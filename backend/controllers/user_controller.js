const db = require("../config/db");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { generateToken } = require("../middleware/jwt");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/;
const SALT_ROUNDS = 10;

const isBcryptHash = (value) =>
  typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);

const verifyPasswordWithLegacySupport = async (plainPassword, storedPassword) => {
  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  return plainPassword === storedPassword;
};

const upgradeLegacyPasswordToHash = async (userId, plainPassword) => {
  const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  await db.query("UPDATE users SET password = ? WHERE id = ?", [passwordHash, userId]);
};

const userSignUp = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (!name || name.length < 20 || name.length > 60) {
      return res
        .status(400)
        .json({ message: "Name must be between 20 and 60 characters." });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email." });
    }
    if (!address || address.length > 400) {
      return res
        .status(400)
        .json({ message: "Address is required and must be at most 400 characters." });
    }
    if (!password || !PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 chars, include 1 uppercase and 1 special character.",
      });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create(name, email, address, passwordHash, "USER");
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findByEmail(email);

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await verifyPasswordWithLegacySupport(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!isBcryptHash(existingUser.password)) {
      await upgradeLegacyPasswordToHash(existingUser.id, password);
    }

    const payload = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    const token = generateToken(payload);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

    const isOldPasswordValid = await verifyPasswordWithLegacySupport(
      oldPassword,
      user[0].password
    );
    if (!isOldPasswordValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [newPasswordHash, userId]);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { userSignUp, userLogin, changePassword };
