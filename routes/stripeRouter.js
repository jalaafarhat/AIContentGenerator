const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  handleStripePayment,
  handleFreeSubscription,
} = require("../controllers/handleStripePayment");

const stripeRouter = express.Router();

stripeRouter.post("/checkout", isAuthenticated, handleStripePayment);
stripeRouter.post("/free-plan", isAuthenticated, handleFreeSubscription);

module.exports = stripeRouter;
