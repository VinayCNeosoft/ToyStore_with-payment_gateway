const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cart: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("cartData", cartSchema);
