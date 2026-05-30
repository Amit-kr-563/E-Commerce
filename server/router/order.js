
const express = require('express');
const router = express.Router();
const Order = require('../schema/order-schema');
const Product = require('../schema/product-schema');
const User = require('../schema/user-schema');
const verifyToken = require('../middleware/authMiddleware');

console.log("Order routes loaded");

router.post('/order', async (req, res) => {
  try {
    const payload = { ...req.body };

    // Normalize user fields so My Orders works reliably even if frontend sends partial user data.
    if (payload.userId) {
      const dbUser = await User.findById(payload.userId).select('email mobile name');
      if (dbUser) {
        payload.username = payload.username || dbUser.email || dbUser.mobile;
        payload.email = payload.email || dbUser.email;
        payload.mobile = payload.mobile || dbUser.mobile;
        payload.fullName = payload.fullName || dbUser.name;
      }
    }

    console.log("=== ORDER CREATION DEBUG ===");
    console.log("Cart Items:", JSON.stringify(payload.cartItems, null, 2));
    console.log("Full Order Data:", JSON.stringify(payload, null, 2));
    
    const order = new Order(payload);
    await order.save();
    
    console.log("Order saved successfully with ID:", order._id);
    console.log("Seller IDs in order:", order.cartItems.map(item => item.sellerId));
    
    // Decrement product stock for each ordered item
    try {
      for (const item of order.cartItems) {
        if (!item.productId) continue;

        try {
          const product = await Product.findById(item.productId);
          if (!product) {
            console.warn(`Product not found for id ${item.productId}`);
            continue;
          }

          const orderedQty = Number(item.quantity) || 0;
          const currentStock = Number(product.stock) || 0;
          const newStock = Math.max(currentStock - orderedQty, 0);

          // Only save if stock actually changed
          if (newStock !== currentStock) {
            product.stock = newStock;
            await product.save();
            console.log(`Product ${product._id} stock updated: ${currentStock} -> ${newStock}`);
          }
        } catch (err) {
          console.error('Failed updating stock for product', item.productId, err);
        }
      }
    } catch (err) {
      console.error('Error while updating product stocks after order save:', err);
    }
    
    res.status(201).json({ message: "Order placed successfully", orderId: order._id });
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get('/order/all', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to get orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get seller's orders - orders containing seller's products
router.get('/api/seller/orders', verifyToken, async (req, res) => {
  try {
    const sellerId = req.userId;
    
    
    // Find all orders that contain products from this seller
    const orders = await Order.find({
      'cartItems.sellerId': sellerId
    }).populate('cartItems.productId').sort({ createdAt: -1 });
    
    console.log("Total orders found with seller's products:", orders.length);
    
    // Filter cart items to show only this seller's products
    const sellerOrders = orders.map(order => {
      console.log("\nProcessing Order:", order._id);
      console.log("Cart items in order:", order.cartItems.length);
      
      const sellerItems = order.cartItems.filter(item => {
        const hasSellerIdField = item.sellerId !== undefined && item.sellerId !== null;
        const matches = hasSellerIdField && item.sellerId.toString() === sellerId.toString();
        console.log(`  Item: ${item.name}, sellerId: ${item.sellerId}, matches: ${matches}`);
        return matches;
      });
      
      console.log("Seller items after filter:", sellerItems.length);
      
      return {
        _id: order._id,
        fullName: order.fullName,
        email: order.email,
        mobile: order.mobile,
        address: order.address,
        paymentMethod: order.paymentMethod,
        cartItems: sellerItems,
        orderTotal: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });
    
    const filteredOrders = sellerOrders.filter(order => order.cartItems.length > 0);
    console.log("Final filtered orders to return:", filteredOrders.length);
    
    res.status(200).json(filteredOrders);
  } catch (err) {
    console.error("Failed to get seller orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get seller order analytics
router.get('/api/seller/order-analytics', verifyToken, async (req, res) => {
  try {
    console.log("Order analytics endpoint hit");
    const sellerId = req.userId;
    console.log("Seller ID:", sellerId);
    
    const orders = await Order.find({
      'cartItems.sellerId': sellerId
    });
    
    let totalOrders = 0;
    let orderedCount = 0;
    let dispatchedCount = 0;
    let deliveredCount = 0;
    let totalRevenue = 0;
    
    orders.forEach(order => {
      order.cartItems.forEach(item => {
        if (item.sellerId && item.sellerId.toString() === sellerId.toString()) {
          totalOrders++;
          totalRevenue += item.price * item.quantity;
          
          if (item.status === 'Ordered') orderedCount++;
          else if (item.status === 'Dispatched') dispatchedCount++;
          else if (item.status === 'Delivered') deliveredCount++;
        }
      });
    });
    
    res.status(200).json({
      totalOrders,
      orderedCount,
      dispatchedCount,
      deliveredCount,
      totalRevenue
    });
  } catch (err) {
    console.error("Failed to get order analytics:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order item status
router.put('/api/seller/order/:orderId/item/:itemIndex/status', verifyToken, async (req, res) => {
  try {
    const { orderId, itemIndex } = req.params;
    const { status } = req.body;
    const sellerId = req.userId;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const item = order.cartItems[itemIndex];
    
    if (!item || item.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    item.status = status;
    await order.save();
    
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error("Failed to update order status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's orders - all orders placed by this user
router.get('/api/user/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const tokenEmail = req.email;
    console.log("=== USER ORDERS DEBUG ===");
    console.log("Fetching orders for userId:", userId);

    // Build robust identifiers: prefer userId, then token email, then user email/mobile from DB.
    const user = await User.findById(userId).select('email mobile name');
    const queryConditions = [{ userId: userId }];

    if (tokenEmail) {
      queryConditions.push({ username: tokenEmail });
      queryConditions.push({ email: tokenEmail });
    }

    if (user?.email) {
      queryConditions.push({ username: user.email });
      queryConditions.push({ email: user.email });
    }

    if (user?.mobile) {
      queryConditions.push({ username: user.mobile });
      queryConditions.push({ mobile: user.mobile });
    }

    console.log("User found:", user ? { email: user.email, mobile: user.mobile, name: user.name } : "No user in DB, using token fallback");

    // Find orders where userId or email/mobile style username matches
    const orders = await Order.find({
      $or: queryConditions
    }).populate('cartItems.productId').sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders for userId ${userId}`);
    if (orders.length > 0) {
      console.log("Sample order usernames:", orders.map(o => o.username));
    }
    
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to get user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
