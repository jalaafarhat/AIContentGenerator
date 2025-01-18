const asyncHandler = require("express-async-handler");
const {
  calculateNextBillingDate,
} = require("../utils/calculateNextBillingDate");
const {
  shouldRenewSubscriptionPlan,
} = require("../utils/shouldRenewSubscriptionPlan");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//stripe payment

const handleStripePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  //get the user
  const user = req?.user;
  try {
    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "usd",
      //add some data the meta object
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });
    //send the response
    res.json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).jsom({ error: error });
  }
});

//verify payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    if (paymentIntent.status === "succeeded") {
      //get the info from meta data
      const metadata = paymentIntent.metadata;
      const subscriptionPlan = metadata.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;

      // find the user
      const userFound = await user.findById(userId);

      if (!userFound) {
        return res
          .status(404)
          .json({ status: "false", message: "user not found" });
      }
      //get the payment details
      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;

      //create the payment history
      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: "success",
        reference: paymentId,
      });
      //check for the sub plan
      if (subscriptionPlan === "Premium") {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate,
          apiRequestCount: 0,
          subscriptionPlan: "Premium",
          monthlyRequestCount: 100,
          $addToSet: { payments: newPayment?._id },
        });
        res.json({
          status: true,
          message: "payment verified, user updated",
          updatedUser,
        });
      }
      if (subscriptionPlan === "Basic") {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate,
          apiRequestCount: 0,
          subscriptionPlan: "Basic",
          monthlyRequestCount: 50,
          $addToSet: { payments: newPayment?._id },
        });
        res.json({
          status: true,
          message: "payment verified, user updated",
          updatedUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//handle free subscription
const handleFreeSubscription = asyncHandler(async (req, res) => {
  //get the login user
  const user = req?.user;

  //calculate the next billing date
  calculateNextBillingDate();
  //check if the user acc will be renewed
  try {
    if (shouldRenewSubscriptionPlan(user)) {
      //update the user acc
      user.subscriptionPlan = "Free";
      user.monthlyRequestCount = 5;
      user.apiRequestCount = 0;
      user.nextBillingDate = calculateNextBillingDate();

      //create new payment and save in db
      const newPayment = await Payment.create({
        user: user?._id,
        subscriptionPlan: "Free",
        amount: 0,
        status: "success",
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 5,
        currency: "usd",
      });
      user.payments.push(newPayment?._id);
      //save the user
      await user.save();
      //send the response
      res.json({
        status: "success",
        message: "subscription plan updates successfully",
        user,
      });
    } else {
      return res
        .status(403)
        .json({ error: "subscription renew is not due yet" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

module.exports = { handleStripePayment, handleFreeSubscription, verifyPayment };
