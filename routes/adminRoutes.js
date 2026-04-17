const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Product = require("../models/product");
const User = require("../models/user");

// GET all products (admin)
router.get("/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: { $ne: true } })
      .populate("seller", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET all users (admin)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user (admin)
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET analytics (admin)
router.get("/analytics", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isDeleted: { $ne: true } });
    const totalUsers = await User.countDocuments();
    const categoryStats = await Product.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.json({ totalProducts, totalUsers, categoryStats });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;