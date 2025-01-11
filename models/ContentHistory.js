const mongoose = require("mongoose");

//schema
const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //auto add the date the doc will be created and updated
  }
);

//! Compile to form the model
const ContentHistory = mongoose.model("ContentHistory", contentSchema);
module.exports = ContentHistory;
