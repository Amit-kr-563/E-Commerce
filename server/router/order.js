
const express = require('express');
const router = express.Router();
const Order = require('../schema/order-schema');
const Product = require('../schema/product-schema');
const User = require('../schema/user-schema');
const verifyToken = require('../middleware/authMiddleware');

console.log("Order routes loaded");

// ==========================================
// 1. PLACE ORDER ROUTE (STOCK DECREMENT LOGIC)
// ==========================================
router.post('/order', async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.userId) {
      const dbUser = await User.findById(payload.userId).select('email mobile name');
      if (dbUser) {
        payload.username = payload.username || dbUser.email || dbUser.mobile;
        payload.email = payload.email || dbUser.email;
        payload.mobile = payload.mobile || dbUser.mobile;
        payload.fullName = payload.fullName || dbUser.name;
      }
    }

    // 💡 TRICK: Mongoose save hone se PEHLE hi frontend se aane wali original product ids ko extract kar lo
    // Kyunki save() hone ke baad order.cartItems ke andar ki _id badal kar sub-document id ban jayegi.
    const originalProductIds = payload.cartItems.map(item => item.productId || item._id);

    const order = new Order(payload);
    await order.save();
    
    // 🔥 STOCK DECREMENT LOGIC (FIXED)
    try {
      for (let i = 0; i < order.cartItems.length; i++) {
        const item = order.cartItems[i];
        // Pehle humne jo original ID nikaali thi, use use karenge
        const targetId = originalProductIds[i]; 

        if (!targetId) {
          console.log(`⚠️ Product ID missing for item: ${item.name}`);
          continue; 
        }

        // Real Product Model se dhundhein
        const product = await Product.findById(targetId);
        
        if (product) {
          const orderedQty = Number(item.quantity) || 0;
          const currentStock = Number(product.stock) || 0;

          // Stock update
          product.stock = Math.max(currentStock - orderedQty, 0);
          await product.save();
          
          console.log(`⚡ STOCK UPDATED: ${product.name} | Purana: ${currentStock} -> Naya: ${product.stock}`);
        } else {
          console.log(`❌ Product not found in DB with ID: ${targetId}`);
        }
      }
    } catch (stockErr) {
      console.error("Stock update karne me error aaya:", stockErr);
    }
    
    res.status(201).json({ message: "Order placed successfully", orderId: order._id });
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// ==========================================
// 2. GET ALL ORDERS (ADMIN / DEBUG)
// ==========================================
router.get('/order/all', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to get orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 3. GET SELLER ORDERS
// ==========================================
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

// ==========================================
// 4. NEW & CORRECT ROUTE: GET SELLER PRODUCT ANALYTICS
// ==========================================
// Yeh route product add hone par automatic badhayega aur order hone par dynamic minus karega.
router.get('/api/seller/analytics', verifyToken, async (req, res) => {
  try {
    const sellerId = req.userId;

    // Live DB se is specific seller ke saare products uthao
    const products = await Product.find({ sellerId: sellerId });

    let totalProducts = products.length; // Naya product aate hi count badh jayega
    let totalStock = 0;
    let totalValue = 0;

    // Loop chala kar dynamic calculations
    products.forEach(product => {
      const stock = Number(product.stock) || 0;
      const price = Number(product.price) || 0;

      totalStock += stock; // Live stock calculation
      totalValue += (stock * price); // Current Stock * Price = Real-time Total Value
    });

    res.status(200).json({
      totalProducts,
      totalStock,
      totalValue
    });
  } catch (err) {
    console.error("Failed to get product analytics:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 5. GET SELLER ORDER ANALYTICS
// ==========================================
router.get('/api/seller/order-analytics', verifyToken, async (req, res) => {
  try {
    const sellerId = req.userId;
    const orders = await Order.find({ 'cartItems.sellerId': sellerId });
    
    let totalOrders = orders.length;
    let orderedCount = 0;
    let dispatchedCount = 0;
    let deliveredCount = 0;
    let totalRevenue = 0;
    
    orders.forEach(order => {
      order.cartItems.forEach(item => {
        if (item.sellerId && item.sellerId.toString() === sellerId.toString()) {
          
          const currentStatus = item.status || 'Ordered'; 
          
          if (currentStatus === 'Ordered') {
            orderedCount++;
          } else if (currentStatus === 'Dispatched') {
            dispatchedCount++;
          } else if (currentStatus === 'Delivered') {
            deliveredCount++;
            // 💰 REVENUE FIXED: Sirf delivered items ka paisa total revenue me judega
            totalRevenue += (Number(item.price) || 0) * (Number(item.quantity) || 0);
          }
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

// ==========================================
// 6. GET USER ORDERS
// ==========================================
router.get('/api/user/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const tokenEmail = req.email;
    console.log("=== USER ORDERS DEBUG ===");
    console.log("Fetching orders for userId:", userId);

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

// ==========================================
// 7. UPDATE ORDER ITEM STATUS
// ==========================================
// PUT: http://localhost:8000/api/seller/order/:orderId/item/:itemId/status
router.put('/order/:orderId/item/:itemId/status', verifyToken, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    // Validation
    const allowedStatus = ['Ordered', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Order dhoondo aur specific cartItem ka status update karo
    const updatedOrder = await Order.findOneAndUpdate(
      { 
        _id: orderId, 
        'cartItems._id': itemId // Specific item id match karein
      },
      { 
        $set: { 'cartItems.$.status': status } // '$' operator matched item ko update karega
      },
      { new: true } // Updated data return karega
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order or Item not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', updatedOrder });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;