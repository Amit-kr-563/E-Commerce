const express = require('express');
const router = express.Router();
const Cart = require('../schema/cart-schema');
const mongoose = require('mongoose');

// Function to calculate bulk discount based on quantity
const calculateBulkDiscount = (quantity) => {
  if (quantity >= 50) {
    return 20; // 20% discount for 50+ items
  } else if (quantity >= 30) {
    return 15; // 15% discount for 30-49 items
  }
  return 0; // No discount for less than 30 items
};

// Function to calculate discounted price
const calculateDiscountedPrice = (originalPrice, discount) => {
  return originalPrice - (originalPrice * discount / 100);
};

// Add to cart
router.post("/cart", async (req, res) => {
  console.log("=== ADD TO CART DEBUG ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  const { username, product } = req.body;

  if (!username) {
    console.log("ERROR: No username provided");
    return res.status(400).json({ error: "Username is required" });
  }

  if (!product) {
    console.log("ERROR: No product provided");
    return res.status(400).json({ error: "Product is required" });
  }

  try {
    const productId = product.id || product._id;
    const sellerId = product.seller?._id || product.seller || product.sellerId;
    
    console.log("Product ID:", productId);
    console.log("Seller ID:", sellerId);
    
    // Check if item already in cart
    const existingItem = await Cart.findOne({ username, productId: productId });

    if (existingItem) {
      console.log("Item exists, incrementing quantity");
      existingItem.quantity += 1;
      
      // If originalPrice doesn't exist (old cart items), set it to current price
      if (!existingItem.originalPrice) {
        existingItem.originalPrice = existingItem.price;
      }
      
      // Recalculate bulk discount based on new quantity
      const bulkDiscount = calculateBulkDiscount(existingItem.quantity);
      existingItem.bulkDiscount = bulkDiscount;
      
      // Calculate discounted price using originalPrice
      const discountedPrice = calculateDiscountedPrice(existingItem.originalPrice, bulkDiscount);
      existingItem.price = discountedPrice;
      
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    console.log("Adding new item to cart");

    // Calculate bulk discount for quantity 1 (will be 0)
    const bulkDiscount = calculateBulkDiscount(1);
    const originalPrice = product.price;
    const discountedPrice = calculateDiscountedPrice(originalPrice, bulkDiscount);

    // Create cart item
    const newCartItem = new Cart({
      username,
      productId: productId,
      sellerId: sellerId,
      name: product.name,
      img: product.img,
      price: discountedPrice,
      originalPrice: originalPrice,
      bulkDiscount: bulkDiscount,
      quantity: 1
    });

    await newCartItem.save();
    console.log("Cart item saved successfully!");
    res.status(201).json(newCartItem);
  } catch (error) {
    console.error("=== CART ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Failed to add to cart", details: error.message });
  }
});

// Get cart by username
router.get("/cart/:username", async (req, res) => {
  try {
    const items = await Cart.find({ username: req.params.username }).populate('sellerId', 'name email');
    // Ensure sellerId is returned in the response
    const formattedItems = items.map(item => ({
      _id: item._id,
      username: item.username,
      productId: item.productId,
      sellerId: item.sellerId?._id || item.sellerId,
      name: item.name,
      img: item.img,
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      bulkDiscount: item.bulkDiscount || 0,
      quantity: item.quantity
    }));
    res.status(200).json(formattedItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart" });
  }
});
router.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Item deleted");
  } catch (err) {
    res.status(500).json("Delete failed");
  }
});
router.put("/cart/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    
    const newQuantity = req.body.quantity;
    
    // If originalPrice doesn't exist (old cart items), set it to current price
    if (!cartItem.originalPrice) {
      cartItem.originalPrice = cartItem.price;
      await cartItem.save();
    }
    
    // Calculate bulk discount based on new quantity
    const bulkDiscount = calculateBulkDiscount(newQuantity);
    
    // Calculate discounted price using originalPrice
    const discountedPrice = calculateDiscountedPrice(cartItem.originalPrice, bulkDiscount);
    
    // Update cart item with new quantity, discount, and price
    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          quantity: newQuantity,
          bulkDiscount: bulkDiscount,
          price: discountedPrice,
          originalPrice: cartItem.originalPrice
        } 
      },
      { new: true }
    );
    
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json("Update failed");
  }
});

// Migration route to fix existing cart items (run once)
router.post("/cart/migrate/fix-prices", async (req, res) => {
  try {
    const itemsToFix = await Cart.find({ originalPrice: { $exists: false } });
    
    let fixedCount = 0;
    for (let item of itemsToFix) {
      item.originalPrice = item.price;
      item.bulkDiscount = 0;
      await item.save();
      fixedCount++;
    }
    
    res.status(200).json({ 
      message: "Migration complete", 
      itemsFixed: fixedCount 
    });
  } catch (err) {
    console.error("Migration error:", err);
    res.status(500).json({ error: "Migration failed" });
  }
});


module.exports = router;
