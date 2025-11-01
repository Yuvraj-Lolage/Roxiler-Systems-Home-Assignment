const express = require('express');
const userRouter = express.Router();
const authenticate = require("../middleware/authenticate");
const { userSignUp, userLogin, changePassword } = require('../controllers/user_controller')

userRouter.post('/signup', userSignUp);
userRouter.post('/login', userLogin);
userRouter.put("/change-password", authenticate ,changePassword)


module.exports = { userRouter };