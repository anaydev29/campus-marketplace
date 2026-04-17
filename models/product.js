const mongoose = require("mongoose");
const adminMiddleware = require("../middleware/adminMiddleware");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    images: [{ type: String }],
    video: {
      type: String,
      default: null,
    },
    condition: {
      type: String,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    isSold: {
     type: Boolean,
     default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
