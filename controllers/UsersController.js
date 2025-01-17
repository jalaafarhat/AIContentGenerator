const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

//Registration
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  //validate
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  //check if email is taken
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists!");
  }
  //hash the user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create the user
  const newUser = new User({ username, email, password: hashedPassword });
  //add the date the trial will end
  newUser.trialExpires = new Date(
    new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );
  //save the user
  await newUser.save();

  res.json({
    status: true,
    message: "Registration was successful",
    user: {
      username,
      email,
    },
  });
});

//Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for user email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("invalid email or password");
  }
  //check for user password
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("invalid email or password");
  }
  //Generate token (jwt)
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "3d", //expires in 3 days
  });
  //set the token into cookie (http only)
  res.cookie("token", token, {
    httpOnly: true,
    SECURE: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });
  //send the response
  res.json({
    status: "success",
    _id: user?._id,
    message: "Login success",
    username: user?.username,
    email: user?.email,
  });
});

//Logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
});
//Profile
const userProfile = asyncHandler(async (req, res) => {
  const id = "67829b67c77a7f7643439be2";
  const user = await User.findById(id).select("-password");
  if (user) {
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
//check user Auth status

module.exports = {
  register,
  login,
  logout,
  userProfile,
};
