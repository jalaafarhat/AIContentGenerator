const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
const { errorHandler } = require("./middlewares/errorMiddlewear");
const openAIRouter = require("./routes/openAIRouter");
const cron = require("node-cron");
const stripeRouter = require("./routes/stripeRouter");
const User = require("./models/User");
require("./utils/connectDB")(); //same as a=require("./utils/connectDB") and calling a()

const app = express();
const PORT = process.env.PORT || 8090;

//cron for the trial period
// 1 second , 1 min, 1 day (run every single day)
cron.schedule("0 0 * * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    const updatedUser = await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        trialActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 5,
      }
    );
  } catch (error) {}
});
//cron for free plan, run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {}
});

//cron for Basic plan, run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {}
});
//cron for Premium plan, run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {}
});
//middlewares
app.use(express.json());
app.use(cookieParser()); //pass the cookie automatically

//Route
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/stripe", stripeRouter);

//error handler middlewear
app.use(errorHandler);

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
