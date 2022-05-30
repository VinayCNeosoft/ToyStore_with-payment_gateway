const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_image: {
    type: String,
  },
  product_desc: {
    type: String,
  },
  product_producer: {
    type: String,
  },
  product_cost: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("productData", productSchema);
