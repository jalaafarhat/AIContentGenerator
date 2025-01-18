const asyncHandler = require("express-async-handler");
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
    console.log(paymentIntent);
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
module.exports = handleStripePayment;
