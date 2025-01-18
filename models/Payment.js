const mongoose = require("mongoose");

//schema
const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reference: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
    subscriptionPlan: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    monthlyRequestCount: {
      type: Number,
    },
  },
  {
    timestamps: true, //auto add the date the doc will be created and updated
  }
);

//! Compile to form the model
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
