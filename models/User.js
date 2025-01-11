const mongoose = require("mongoose");

//schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    trialPeriod: {
      type: Number,
      default: 3, //3 days
    },
    trialActive: {
      type: Boolean,
      default: true,
    },
    trialExpires: {
      type: Date,
    },
    subscription: {
      type: String,
      enum: ["Trial", "Free", "Basic", "Premium"],
    },
    apiRequestCount: {
      type: Number,
      default: 0,
    },
    nextBillingDate: Date,
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    History: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "History",
      },
    ],
  },
  {
    timestamps: true, //auto add the date the doc will be created and updated
  }
);

//! Compile to form the model
const User = mongoose.model("User", userSchema);
module.exports = User;
