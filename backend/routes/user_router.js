const express = require('express');
const userRouter = express.Router();
const authenticate = require("../middleware/authenticate");
const { userSignUp, userLogin, changePassword } = require('../controllers/user_controller');
const { createRateLimiter } = require("../middleware/rate_limiter");

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts. Please try again in 15 minutes.",
});

userRouter.post('/signup', authLimiter, userSignUp);
userRouter.post('/login', authLimiter, userLogin);
userRouter.put("/change-password", authenticate, authLimiter, changePassword);


module.exports = { userRouter };
