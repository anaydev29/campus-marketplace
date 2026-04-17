const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
const Product = require("../models/product");

// GET wishlist
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "wishlist",
      populate: { path: "seller", select: "name email contact" },
    });
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST toggle wishlist (add if not present, remove if present)
router.post("/:productId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { productId } = req.params;

    const isWishlisted = user.wishlist.includes(productId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.json({ wishlisted: !isWishlisted, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;