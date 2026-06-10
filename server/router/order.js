






const express = require('express');
const router = express.Router();
const Order = require('../schema/order-schema');
const Product = require('../schema/product-schema');
const verifyToken = require('../middleware/authMiddleware');

console.log("Order routes loaded successfully");


router.post('/order', async (req, res) => {
  try {
    console.log("=== ORDER CREATION (STOCK ON DELIVERED MODE) ===");
    
    const structuredCartItems = req.body.cartItems.map(item => ({
      productId: item.productId || item._id, 
      sellerId: item.sellerId || item.seller, 
      name: item.name,
      price: item.price,
      quantity: Number(item.quantity) || 1, // क्वांटिटी को नंबर में कन्वर्ट किया
      img: item.img,
      status: 'Ordered' // शुरुआती स्टेटस
    }));

    const orderData = {
      ...req.body,
      cartItems: structuredCartItems,
      status: 'Pending' 
    };

    const order = new Order(orderData);
    await order.save();
    
    res.status(201).json({ message: "Order placed successfully", orderId: order._id });
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// 2. GET ALL ORDERS (For Admin)
router.get('/order/all', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to get orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 3. GET SELLER'S ORDERS
router.get('/api/seller/orders', verifyToken, async (req, res) => {
  try {
    const sellerId = req.userId;
    
    // उन सभी ऑर्डर्स को ढूंढें जिनमें इस सेलर का कोई प्रोडक्ट है
    const orders = await Order.find({
      'cartItems.sellerId': sellerId
    }).sort({ createdAt: -1 });
    
    // सिर्फ इसी पर्टिकुलर सेलर के आइटम्स को फ़िल्टर करके फ़्रंटएंड को भेजें
    const sellerOrders = orders.map(order => {
      const sellerItems = order.cartItems.filter(
        item => item.sellerId && item.sellerId.toString() === sellerId.toString()
      );
      
      return {
        _id: order._id,
        fullName: order.fullName,
        email: order.email,
        mobile: order.mobile,
        address: order.address,
        paymentMethod: order.paymentMethod,
        cartItems: sellerItems,
        // सिर्फ इस सेलर के सामानों का टोटल अमाउंट कैलकुलेट करें
        orderTotal: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: order.status, // मेन ऑर्डर स्टेटस
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });
    
    const filteredOrders = sellerOrders.filter(order => order.cartItems.length > 0);
    res.status(200).json(filteredOrders);
  } catch (err) {
    console.error("Failed to get seller orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 4. GET SELLER ORDER ANALYTICS (Real-Time Counters)
router.get('/api/seller/order-analytics', verifyToken, async (req, res) => {
  try {
    const sellerId = req.userId;
    const orders = await Order.find({ 'cartItems.sellerId': sellerId });
    
    let totalOrders = 0;
    let orderedCount = 0;
    let dispatchedCount = 0;
    let deliveredCount = 0;
    let totalRevenue = 0;
    
    orders.forEach(order => {
      let hasSellerItem = false;
      order.cartItems.forEach(item => {
        if (item.sellerId && item.sellerId.toString() === sellerId.toString()) {
          hasSellerItem = true;
          
          // रेवेन्यू केवल डिलीवर या एक्टिव ऑर्डर्स का जोड़ें (कैंसिल का नहीं)
          if (item.status !== 'Cancelled') {
            totalRevenue += item.price * item.quantity;
          }
          
          if (item.status === 'Ordered') orderedCount++;
          else if (item.status === 'Dispatched') dispatchedCount++;
          else if (item.status === 'Delivered') deliveredCount++;
        }
      });
      if (hasSellerItem) totalOrders++;
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


router.put('/api/seller/order/:orderId/item/:itemId/status', verifyToken, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body; // 'Dispatched' या 'Delivered'
    const sellerId = req.userId;

    if (!['Ordered', 'Dispatched', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // पहले मौजूदा ऑर्डर और आइटम की स्थिति निकालें (ताकि पता चले कि पहले से डिलीवर तो नहीं था)
    const orderBeforeUpdate = await Order.findOne({
      _id: orderId,
      'cartItems._id': itemId,
      'cartItems.sellerId': sellerId
    });

    if (!orderBeforeUpdate) {
      return res.status(404).json({ message: 'Order or Item not found' });
    }

    // उस पर्टिकुलर आइटम को निकालें जिसका स्टेटस बदला जा रहा है
    const targetItem = orderBeforeUpdate.cartItems.id(itemId);
    const previousStatus = targetItem.status;
    const targetQuantity = Number(targetItem.quantity) || 1; // सटीक क्वांटिटी

    // डेटाबेस में स्टेटस अपडेट करें
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, 'cartItems._id': itemId, 'cartItems.sellerId': sellerId },
      { $set: { 'cartItems.$.status': status } },
      { new: true }
    );

    // 🔥 कंडीशन: स्टॉक केवल तब घटेगा जब स्टेटस 'Delivered' होगा और पहले से Delivered नहीं था
    if (status === 'Delivered' && previousStatus !== 'Delivered') {
      if (targetItem.productId) {
        // $inc में -targetQuantity पास करने से पूरी की पूरी क्वांटिटी एक साथ घट जाएगी
        await Product.findByIdAndUpdate(targetItem.productId, {
          $inc: { stock: -targetQuantity }
        });
        console.log(`Product ${targetItem.productId} delivered. Stock reduced by ${targetQuantity}`);
      }
    }

    // 🔄 रिवर्स कंडीशन: अगर डिलीवर होने के बाद ऑर्डर कभी Cancelled या री-अपडेट होता है, तो स्टॉक वापस बढ़ जाए
    if (status !== 'Delivered' && previousStatus === 'Delivered') {
      if (targetItem.productId) {
        await Product.findByIdAndUpdate(targetItem.productId, {
          $inc: { stock: targetQuantity }
        });
        console.log(`Product reverted. Stock increased back by ${targetQuantity}`);
      }
    }

    // मुख्य ऑर्डर के स्टेटस को सिंक करना (अगर सब Delivered हो गए तो Completed)
    const allItemsDelivered = updatedOrder.cartItems.every(item => item.status === 'Delivered');
    if (allItemsDelivered) {
      updatedOrder.status = 'Completed';
    } else if (status === 'Dispatched') {
      updatedOrder.status = 'Processing';
    }
    await updatedOrder.save();

    res.status(200).json({ message: 'Status and live stock updated', updatedOrder });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// 5. GET LOGGED-IN USER'S ORDERS
router.get('/api/user/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // Middleware se aayi hui logged-in user ki ID
    
    console.log("Fetching orders for User ID:", userId);

    // Database me us userId ke saare orders dhoondhein
    const userOrders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
    
    res.status(200).json(userOrders);
  } catch (err) {
    console.error("Failed to get user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;