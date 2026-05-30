const express = require('express');
const router = express.Router();
const Product = require('../schema/product-schema');
const verifyToken = require('../middleware/authMiddleware');

// Get all products
router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.status(200).json(products);
  } catch (error) {
    console.log("Get Products Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get products by category
router.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).populate('seller', 'name email');
    res.status(200).json(products);
  } catch (error) {
    console.log("Get Products by Category Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get products by subcategory
router.get('/api/products/subcategory/:subcategory', async (req, res) => {
  try {
    const { subcategory } = req.params;
    const products = await Product.find({ subcategory }).populate('seller', 'name email');
    res.status(200).json(products);
  } catch (error) {
    console.log("Get Products by Subcategory Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get products by category and subcategory
router.get('/api/products/category/:category/subcategory/:subcategory', async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const products = await Product.find({ category, subcategory }).populate('seller', 'name email');
    res.status(200).json(products);
  } catch (error) {
    console.log("Get Products by Category and Subcategory Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get random products for homepage
router.get('/api/products/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 12;
    const products = await Product.aggregate([
      { $sample: { size: count } }
    ]);
    res.status(200).json(products);
  } catch (error) {
    console.log("Get Random Products Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get single product by id
router.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("Get Product Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get seller's products
router.get('/api/seller/products', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.userId });
    res.status(200).json(products);
  } catch (error) {
    console.log("Get Seller Products Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Add new product (Seller only)
router.post('/api/products', verifyToken, async (req, res) => {
  try {
    const { name, img, price, originalprice, category, subcategory, description, stock } = req.body;
    
    // Auto-calculate discount percentage
    let discount = '0%';
    if (originalprice && price && originalprice > price) {
      const discountPercent = Math.round(((originalprice - price) / originalprice) * 100);
      discount = `${discountPercent}%`;
    }
    
    const product = new Product({
      name,
      img,
      price,
      originalprice,
      discount,
      category,
      subcategory,
      description,
      stock,
      seller: req.userId
    });
    
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.log("Add Product Error:", error);
    console.log("Request Body:", req.body);
    res.status(500).json({ message: error.message || "Something went wrong", error: error.toString() });
  }
});

// Update product (Seller only)
router.put('/api/products/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.userId });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }
    
    const { name, img, price, originalprice, category, subcategory, description, stock } = req.body;
    
    product.name = name || product.name;
    product.img = img || product.img;
    product.price = price !== undefined ? price : product.price;
    product.originalprice = originalprice !== undefined ? originalprice : product.originalprice;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.description = description || product.description;
    product.stock = stock !== undefined ? stock : product.stock;
    
    // Auto-calculate discount percentage
    if (product.originalprice && product.price && product.originalprice > product.price) {
      const discountPercent = Math.round(((product.originalprice - product.price) / product.originalprice) * 100);
      product.discount = `${discountPercent}%`;
    } else {
      product.discount = '0%';
    }
    
    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.log("Update Product Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Delete product (Seller only)
router.delete('/api/products/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.userId });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }
    
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Delete Product Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get product analytics for seller
router.get('/api/seller/analytics', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.userId });
    
    const analytics = {
      totalProducts: products.length,
      categories: {
        Men: products.filter(p => p.category === 'Men').length,
        Women: products.filter(p => p.category === 'Women').length,
        Kids: products.filter(p => p.category === 'Kids').length
      },
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    };
    
    res.status(200).json(analytics);
  } catch (error) {
    console.log("Analytics Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
