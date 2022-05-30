const mongoose = require("mongoose");

const txnListSchema = new mongoose.Schema(
  {
    total: { type: String },
    orderID: { type: String },
    paymentID: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("txnData", txnListSchema);
