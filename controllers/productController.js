const Product = require("../models/product");

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageFiles = req.files?.images || [];
    const images = imageFiles.map((f) => f.filename);
    const video = req.files?.video?.[0]?.filename || null;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition,
      image: images[0] || null,      // first image as cover (backwards compat)
      images,                         // all images array
      video,                          // optional video file
      seller: req.user.id,
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = { isDeleted: { $ne: true }, isSold: { $ne: true } };

    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    const products = await Product.find(query)
      .populate("seller", "name contact")
      .sort(sortOption);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};