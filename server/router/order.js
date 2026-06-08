
// // const express = require('express');
// // const router = express.Router();
// // const Order = require('../schema/order-schema');
// // const Product = require('../schema/product-schema');
// // const User = require('../schema/user-schema');
// // const verifyToken = require('../middleware/authMiddleware');

// // console.log("Order routes loaded");

// // // router.post('/order', async (req, res) => {
// // //   try {
// // //     const payload = { ...req.body };

// // //     // Normalize user fields so My Orders works reliably even if frontend sends partial user data.
// // //     if (payload.userId) {
// // //       const dbUser = await User.findById(payload.userId).select('email mobile name');
// // //       if (dbUser) {
// // //         payload.username = payload.username || dbUser.email || dbUser.mobile;
// // //         payload.email = payload.email || dbUser.email;
// // //         payload.mobile = payload.mobile || dbUser.mobile;
// // //         payload.fullName = payload.fullName || dbUser.name;
// // //       }
// // //     }

// // //     console.log("=== ORDER CREATION DEBUG ===");
// // //     console.log("Cart Items:", JSON.stringify(payload.cartItems, null, 2));
// // //     console.log("Full Order Data:", JSON.stringify(payload, null, 2));
    
// // //     const order = new Order(payload);
// // //     await order.save();
    
// // //     console.log("Order saved successfully with ID:", order._id);
// // //     console.log("Seller IDs in order:", order.cartItems.map(item => item.sellerId));
    
// // //     // Decrement product stock for each ordered item
// // //     try {
// // //       for (const item of order.cartItems) {
// // //         if (!item.productId) continue;

// // //         try {
// // //           const product = await Product.findById(item.productId);
// // //           if (!product) {
// // //             console.warn(`Product not found for id ${item.productId}`);
// // //             continue;
// // //           }

// // //           const orderedQty = Number(item.quantity) || 0;
// // //           const currentStock = Number(product.stock) || 0;
// // //           const newStock = Math.max(currentStock - orderedQty, 0);

// // //           // Only save if stock actually changed
// // //           if (newStock !== currentStock) {
// // //             product.stock = newStock;
// // //             await product.save();
// // //             console.log(`Product ${product._id} stock updated: ${currentStock} -> ${newStock}`);
// // //           }
// // //         } catch (err) {
// // //           console.error('Failed updating stock for product', item.productId, err);
// // //         }
// // //       }
// // //     } catch (err) {
// // //       console.error('Error while updating product stocks after order save:', err);
// // //     }
    
// // //     res.status(201).json({ message: "Order placed successfully", orderId: order._id });
// // //   } catch (err) {
// // //     console.error("Order Save Error:", err);
// // //     res.status(500).json({ error: "Failed to place order" });
// // //   }
// // // });

// // router.post('/order', async (req, res) => {
// //   try {
// //     const payload = { ...req.body };

// //     if (payload.userId) {
// //       const dbUser = await User.findById(payload.userId).select('email mobile name');
// //       if (dbUser) {
// //         payload.username = payload.username || dbUser.email || dbUser.mobile;
// //         payload.email = payload.email || dbUser.email;
// //         payload.mobile = payload.mobile || dbUser.mobile;
// //         payload.fullName = payload.fullName || dbUser.name;
// //       }
// //     }

// //     const order = new Order(payload);
// //     await order.save();
    
// //     // 🔥 STOCK DECREMENT LOGIC (SAFE VERSION)
// //     try {
// //       for (const item of order.cartItems) {
// //         // Frontend se ya to productId aayega ya _id, dono ko accept karo
// //         const targetId = item.productId || item._id; 

// //         if (!targetId) {
// //           console.log(`⚠️ Product ID missing for item: ${item.name}`);
// //           continue; 
// //         }

// //         // Database se product dhoondho
// //         const product = await Product.findById(targetId);
        
// //         if (product) {
// //           const orderedQty = Number(item.quantity) || 0;
// //           const currentStock = Number(product.stock) || 0;

// //           // Naya stock zero se kam nahi hona chahiye
// //           product.stock = Math.max(currentStock - orderedQty, 0);
// //           await product.save();
          
// //           console.log(`⚡ STOCK UPDATED: ${product.name} | Purana: ${currentStock} -> Naya: ${product.stock}`);
// //         } else {
// //           console.log(`❌ Product not found in DB with ID: ${targetId}`);
// //         }
// //       }
// //     } catch (stockErr) {
// //       console.error("Stock update karne me error aaya:", stockErr);
// //     }
    
// //     res.status(201).json({ message: "Order placed successfully", orderId: order._id });
// //   } catch (err) {
// //     console.error("Order Save Error:", err);
// //     res.status(500).json({ error: "Failed to place order" });
// //   }
// // });

// // router.get('/order/all', async (req, res) => {
// //   try {
// //     const orders = await Order.find({});
// //     res.status(200).json(orders);
// //   } catch (err) {
// //     console.error("Failed to get orders:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });



// // // Get seller's orders - orders containing seller's products
// // router.get('/api/seller/orders', verifyToken, async (req, res) => {
// //   try {
// //     const sellerId = req.userId;
    
    
// //     // Find all orders that contain products from this seller
// //     const orders = await Order.find({
// //       'cartItems.sellerId': sellerId
// //     }).populate('cartItems.productId').sort({ createdAt: -1 });
    
// //     console.log("Total orders found with seller's products:", orders.length);
    
// //     // Filter cart items to show only this seller's products
// //     const sellerOrders = orders.map(order => {
// //       console.log("\nProcessing Order:", order._id);
// //       console.log("Cart items in order:", order.cartItems.length);
      
// //       const sellerItems = order.cartItems.filter(item => {
// //         const hasSellerIdField = item.sellerId !== undefined && item.sellerId !== null;
// //         const matches = hasSellerIdField && item.sellerId.toString() === sellerId.toString();
// //         console.log(`  Item: ${item.name}, sellerId: ${item.sellerId}, matches: ${matches}`);
// //         return matches;
// //       });
      
// //       console.log("Seller items after filter:", sellerItems.length);
      
// //       return {
// //         _id: order._id,
// //         fullName: order.fullName,
// //         email: order.email,
// //         mobile: order.mobile,
// //         address: order.address,
// //         paymentMethod: order.paymentMethod,
// //         cartItems: sellerItems,
// //         orderTotal: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
// //         createdAt: order.createdAt,
// //         updatedAt: order.updatedAt
// //       };
// //     });
    
// //     const filteredOrders = sellerOrders.filter(order => order.cartItems.length > 0);
// //     console.log("Final filtered orders to return:", filteredOrders.length);
    
// //     res.status(200).json(filteredOrders);
// //   } catch (err) {
// //     console.error("Failed to get seller orders:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // // Get seller order analytics
// // // router.get('/api/seller/order-analytics', verifyToken, async (req, res) => {
// // //   try {
// // //     console.log("Order analytics endpoint hit");
// // //     const sellerId = req.userId;
// // //     console.log("Seller ID:", sellerId);
    
// // //     const orders = await Order.find({
// // //       'cartItems.sellerId': sellerId
// // //     });
    
// // //     let totalOrders = 0;
// // //     let orderedCount = 0;
// // //     let dispatchedCount = 0;
// // //     let deliveredCount = 0;
// // //     let totalRevenue = 0;
    
// // //     orders.forEach(order => {
// // //       order.cartItems.forEach(item => {
// // //         if (item.sellerId && item.sellerId.toString() === sellerId.toString()) {
// // //           totalOrders++;
// // //           totalRevenue += item.price * item.quantity;
          
// // //           if (item.status === 'Ordered') orderedCount++;
// // //           else if (item.status === 'Dispatched') dispatchedCount++;
// // //           else if (item.status === 'Delivered') deliveredCount++;
// // //         }
// // //       });
// // //     });
    
// // //     res.status(200).json({
// // //       totalOrders,
// // //       orderedCount,
// // //       dispatchedCount,
// // //       deliveredCount,
// // //       totalRevenue
// // //     });
// // //   } catch (err) {
// // //     console.error("Failed to get order analytics:", err);
// // //     res.status(500).json({ message: "Server error" });
// // //   }
// // // });

// // // Get seller order analytics
// // router.get('/api/seller/order-analytics', verifyToken, async (req, res) => {
// //   try {
// //     const sellerId = req.userId;
// //     const orders = await Order.find({ 'cartItems.sellerId': sellerId });
    
// //     let totalOrders = orders.length;
// //     let orderedCount = 0;
// //     let dispatchedCount = 0;
// //     let deliveredCount = 0;
// //     let totalRevenue = 0;
    
// //     orders.forEach(order => {
// //       order.cartItems.forEach(item => {
// //         if (item.sellerId && item.sellerId.toString() === sellerId.toString()) {
          
// //           const currentStatus = item.status || 'Ordered'; 
          
// //           if (currentStatus === 'Ordered') {
// //             orderedCount++;
// //           } else if (currentStatus === 'Dispatched') {
// //             dispatchedCount++;
// //           } else if (currentStatus === 'Delivered') {
// //             deliveredCount++;
// //             // 💰 REVENUE FIXED: Sirf delivered items ka paisa total revenue me judega
// //             totalRevenue += (Number(item.price) || 0) * (Number(item.quantity) || 0);
// //           }
// //         }
// //       });
// //     });
    
// //     res.status(200).json({
// //       totalOrders,
// //       orderedCount,
// //       dispatchedCount,
// //       deliveredCount,
// //       totalRevenue
// //     });
// //   } catch (err) {
// //     console.error("Failed to get order analytics:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // // Get user's orders - all orders placed by this user
// // router.get('/api/user/orders', verifyToken, async (req, res) => {
// //   try {
// //     const userId = req.userId;
// //     const tokenEmail = req.email;
// //     console.log("=== USER ORDERS DEBUG ===");
// //     console.log("Fetching orders for userId:", userId);

// //     // Build robust identifiers: prefer userId, then token email, then user email/mobile from DB.
// //     const user = await User.findById(userId).select('email mobile name');
// //     const queryConditions = [{ userId: userId }];

// //     if (tokenEmail) {
// //       queryConditions.push({ username: tokenEmail });
// //       queryConditions.push({ email: tokenEmail });
// //     }

// //     if (user?.email) {
// //       queryConditions.push({ username: user.email });
// //       queryConditions.push({ email: user.email });
// //     }

// //     if (user?.mobile) {
// //       queryConditions.push({ username: user.mobile });
// //       queryConditions.push({ mobile: user.mobile });
// //     }

// //     console.log("User found:", user ? { email: user.email, mobile: user.mobile, name: user.name } : "No user in DB, using token fallback");

// //     // Find orders where userId or email/mobile style username matches
// //     const orders = await Order.find({
// //       $or: queryConditions
// //     }).populate('cartItems.productId').sort({ createdAt: -1 });

// //     console.log(`Found ${orders.length} orders for userId ${userId}`);
// //     if (orders.length > 0) {
// //       console.log("Sample order usernames:", orders.map(o => o.username));
// //     }
    
// //     res.status(200).json(orders);
// //   } catch (err) {
// //     console.error("Failed to get user orders:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });




// module.exports = router;
const express = require('express');
const router = express.Router();
const Order = require('../schema/order-schema');
const Product = require('../schema/product-schema');
const User = require('../schema/user-schema');
const verifyToken = require('../middleware/authMiddleware');

console.log("Order routes loaded");

// ==========================================
// 1. PLACE ORDER ROUTE
// ==========================================
// router.post('/order', async (req, res) => {
//   try {
//     const payload = { ...req.body };

//     if (payload.userId) {
//       const dbUser = await User.findById(payload.userId).select('email mobile name');
//       if (dbUser) {
//         payload.username = payload.username || dbUser.email || dbUser.mobile;
//         payload.email = payload.email || dbUser.email;
//         payload.mobile = payload.mobile || dbUser.mobile;
//         payload.fullName = payload.fullName || dbUser.name;
//       }
//     }

//     const order = new Order(payload);
//     await order.save();
    
//     // STOCK DECREMENT LOGIC
//     try {
//       for (const item of order.cartItems) {
//         const targetId = item.productId || item._id; 

//         if (!targetId) {
//           console.log(`⚠️ Product ID missing for item: ${item.name}`);
//           continue; 
//         }

//         const product = await Product.findById(targetId);
        
//         if (product) {
//           const orderedQty = Number(item.quantity) || 0;
//           const currentStock = Number(product.stock) || 0;

//           product.stock = Math.max(currentStock - orderedQty, 0);
//           await product.save();
          
//           console.log(`⚡ STOCK UPDATED: ${product.name} | Purana: ${currentStock} -> Naya: ${product.stock}`);
//         } else {
//           console.log(`❌ Product not found in DB with ID: ${targetId}`);
//         }
//       }
//     } catch (stockErr) {
//       console.error("Stock update karne me error aaya:", stockErr);
//     }
    
//     res.status(201).json({ message: "Order placed successfully", orderId: order._id });
//   } catch (err) {
//     console.error("Order Save Error:", err);
//     res.status(500).json({ error: "Failed to place order" });
//   }
// });

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
    
    const orders = await Order.find({
      'cartItems.sellerId': sellerId
    }).populate('cartItems.productId').sort({ createdAt: -1 });
    
    console.log("Total orders found with seller's products:", orders.length);
    
    const sellerOrders = orders.map(order => {
      const sellerItems = order.cartItems.filter(item => {
        const hasSellerIdField = item.sellerId !== undefined && item.sellerId !== null;
        return hasSellerIdField && item.sellerId.toString() === sellerId.toString();
      });
      
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
    res.status(200).json(filteredOrders);
  } catch (err) {
    console.error("Failed to get seller orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 4. GET SELLER ANALYTICS
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
// GET: http://localhost:8000/api/seller/analytics
router.get('/api/seller/analytics', verifyToken, async (req, res) => {
  try {
    const sellerId = req.userId;

    // Seller ke saare products database se nikalein
    const products = await Product.find({ sellerId: sellerId });

    let totalProducts = products.length;
    let totalStock = 0;
    let totalValue = 0;

    products.forEach(product => {
      const stock = Number(product.stock) || 0;
      const price = Number(product.price) || 0;

      totalStock += stock;
      // Real-time Total Value = Current Stock * Product Price
      totalValue += (stock * price);
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
// 5. GET USER ORDERS
// ==========================================
router.get('/api/user/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const tokenEmail = req.email;

    const user = await User.findById(userId).select('email mobile name');
    const queryConditions = [{ userId: userId }];

    if (tokenEmail) {
      queryConditions.push({ username: tokenEmail }, { email: tokenEmail });
    }
    if (user?.email) {
      queryConditions.push({ username: user.email }, { email: user.email });
    }
    if (user?.mobile) {
      queryConditions.push({ username: user.mobile }, { mobile: user.mobile });
    }

    const orders = await Order.find({
      $or: queryConditions
    }).populate('cartItems.productId').sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to get user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 6. UPDATE ORDER ITEM STATUS (FIXED ROUTE)
// ==========================================
// URL updated to map perfectly with frontend: http://localhost:8000/api/seller/order/:orderId/item/:itemId/status
router.put('/api/seller/order/:orderId/item/:itemId/status', verifyToken, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;
    const sellerId = req.userId; // verifyToken se sellerId mil rahi hai

    // 1. Valid Status Check
    const allowedStatus = ['Ordered', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // 2. Find and Update only if this item belongs to the logged-in seller
    const updatedOrder = await Order.findOneAndUpdate(
      { 
        _id: orderId, 
        'cartItems._id': itemId,
        'cartItems.sellerId': sellerId // Security: ensure seller owns this product item
      },
      { 
        $set: { 'cartItems.$.status': status } 
      },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ 
        message: 'Order or Item not found, or you do not have permission to update this item.' 
      });
    }

    res.status(200).json({ message: 'Status updated successfully', updatedOrder });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;