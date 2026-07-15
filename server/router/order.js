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
      quantity: Number(item.quantity) || 1, 
      img: item.img,
      status: 'Ordered' 
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

router.get('/order/all', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to get orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/api/seller/orders', verifyToken, async (req, res) => {
  try {
    const sellerId = req.userId;
    
    const orders = await Order.find({
      'cartItems.sellerId': sellerId
    }).sort({ createdAt: -1 });
    
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
        orderTotal: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: order.status, 
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
    const { status } = req.body; 
    const sellerId = req.userId;

    if (!['Ordered', 'Dispatched', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const orderBeforeUpdate = await Order.findOne({
      _id: orderId,
      'cartItems._id': itemId,
      'cartItems.sellerId': sellerId
    });

    if (!orderBeforeUpdate) {
      return res.status(404).json({ message: 'Order or Item not found' });
    }

    const targetItem = orderBeforeUpdate.cartItems.id(itemId);
    const previousStatus = targetItem.status;
    const targetQuantity = Number(targetItem.quantity) || 1; 

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, 'cartItems._id': itemId, 'cartItems.sellerId': sellerId },
      { $set: { 'cartItems.$.status': status } },
      { new: true }
    );

    if (status === 'Delivered' && previousStatus !== 'Delivered') {
      if (targetItem.productId) {
        await Product.findByIdAndUpdate(targetItem.productId, {
          $inc: { stock: -targetQuantity }
        });
        console.log(`Product ${targetItem.productId} delivered. Stock reduced by ${targetQuantity}`);
      }
    }

    if (status !== 'Delivered' && previousStatus === 'Delivered') {
      if (targetItem.productId) {
        await Product.findByIdAndUpdate(targetItem.productId, {
          $inc: { stock: targetQuantity }
        });
        console.log(`Product reverted. Stock increased back by ${targetQuantity}`);
      }
    }

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

router.get('/api/user/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.userId; 
    
    console.log("Fetching orders for User ID:", userId);

    const userOrders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
    
    res.status(200).json(userOrders);
  } catch (err) {
    console.error("Failed to get user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;