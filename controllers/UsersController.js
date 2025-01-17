const bcrypt = require("bcryptjs");
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
  //set the token into cookie (http only)

  //send the response
  res.json({
    status: "success",
    _if: user?._id,
    message: "Login success",
    username: user?.username,
    email: user?.email,
  });
});

//Logout

//Profile

//check user Auth status

module.exports = {
  register,
  login,
};
