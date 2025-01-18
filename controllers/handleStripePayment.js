const asyncHandler = require("express-async-handler");
const {
  calculateNextBillingDate,
} = require("../utils/calculateNextBillingDate");
const {
  shouldRenewSubscriptionPlan,
} = require("../utils/shouldRenewSubscriptionPlan");
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
      oaymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).jsom({ error: error });
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

module.exports = { handleStripePayment, handleFreeSubscription };
