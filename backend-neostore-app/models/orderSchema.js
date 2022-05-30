const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    order: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("orderData", orderSchema);
