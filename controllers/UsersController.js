const User = require("../models/User");
const bcrypt = require("bcryptjs");
//Registration
const register = async (req, res) => {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
};

//Login

//Logout

//Profile

//check user Auth status

module.exports = {
  register,
};
