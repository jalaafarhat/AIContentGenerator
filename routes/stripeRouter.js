const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const handleStripePayment = require("../controllers/handleStripePayment");

const stripeRouter = express.Router();

stripeRouter.post("/checkout", isAuthenticated, handleStripePayment);

module.exports = stripeRouter;
