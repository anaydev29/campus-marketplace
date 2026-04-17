const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Review = require("../models/review");
const User = require("../models/user");

// GET all reviews for a product
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    res.json({ reviews, avgRating, total: reviews.length });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST add a review — only if user has contacted the seller
router.post("/:productId", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    // Check if user has contacted seller for this product
    const user = await User.findById(req.user.id);
    const hasContacted = user.contactedProducts.some(
      (id) => id.toString() === productId
    );
    if (!hasContacted) {
      return res.status(403).json({
        message: "You can only review products you have contacted the seller for",
      });
    }

    if (!rating || !comment?.trim()) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const existing = await Review.findOne({ product: productId, reviewer: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      reviewer: req.user.id,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const populated = await review.populate("reviewer", "name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a review — only the reviewer
router.delete("/:reviewId", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.reviewer.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;