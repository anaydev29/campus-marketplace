const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createProduct,
  getAllProducts,
  getMyProducts,
  deleteProduct,
} = require("../controllers/productController");

// Public
router.get("/", getAllProducts);

// User routes
router.post("/add", authMiddleware, upload.fields([{ name: "images", maxCount: 3 }, { name: "video", maxCount: 1 }]), createProduct);
router.get("/my", authMiddleware, getMyProducts);
router.delete("/:id", authMiddleware, deleteProduct);

// Edit product
router.put("/:id", authMiddleware, upload.fields([{ name: "images", maxCount: 3 }, { name: "video", maxCount: 1 }]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, price, category, condition, keepImages, keepVideo } = req.body;

    // New uploaded images
    const newImages = req.files?.images?.map((f) => f.filename) || [];
    const newVideo = req.files?.video?.[0]?.filename || null;

    // keepImages is a JSON array of existing image filenames to keep
    let existingImages = [];
    try {
      existingImages = keepImages ? JSON.parse(keepImages) : [];
    } catch {
      existingImages = [];
    }

    const finalImages = [...existingImages, ...newImages].slice(0, 3);

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.category = category || product.category;
    product.condition = condition || product.condition;
    product.images = finalImages;
    product.image = finalImages[0] || null;
    product.video = newVideo || (keepVideo === "true" ? product.video : null);

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Toggle sold
router.patch("/:id/sold", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    product.isSold = !product.isSold;
    await product.save();
    res.json({ isSold: product.isSold });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin routes
router.get("/admin/deleted", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/admin/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.isDeleted = true;
    await product.save();
    res.json({ message: "Product moved to trash" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/admin/restore/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.isDeleted = false;
    await product.save();
    res.json({ message: "Product restored successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email contact");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/contact", authMiddleware, async (req, res) => {
  try {
    const User = require("../models/user");
    const user = await User.findById(req.user.id);
    if (!user.contactedProducts.includes(req.params.id)) {
      user.contactedProducts.push(req.params.id);
      await user.save();
    }
    res.json({ message: "Contact recorded" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;