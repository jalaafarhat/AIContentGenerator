const express = require("express");
const {
  register,
  login,
  logout,
  userProfile,
} = require("../controllers/UsersController");
const isAuthinticated = require("../middlewares/isAuthinticated");

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/logout", logout);
usersRouter.get("/profile", isAuthinticated, userProfile);

module.exports = usersRouter;
