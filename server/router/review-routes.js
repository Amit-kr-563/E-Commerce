const express = require('express');
const router = express.Router();
const Review = require('../schema/review-schema');
const Order = require('../schema/order-schema');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/api/reviews', authMiddleware, async (req, res) => {
  try {
    const { productId, orderId, rating, review } = req.body;
    const userId = req.userId;
    
    console.log("=== REVIEW SUBMISSION DEBUG ===");
    console.log("Request Body:", req.body);
    console.log("User ID:", userId);
    console.log("Product ID:", productId);
    console.log("Order ID:", orderId);
    console.log("Rating:", rating);
    console.log("Review:", review);
    console.log("Field checks:");
    console.log("- productId:", !!productId);
    console.log("- orderId:", !!orderId);
    console.log("- rating:", !!rating);
    console.log("- review:", !!review);

    if (!productId || !orderId || !rating || !review) {
      console.log("Validation failed - missing fields");
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { productId: !!productId, orderId: !!orderId, rating: !!rating, review: !!review }
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const User = require('../schema/user-schema');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userName = user.name || user.email?.split('@')[0] || 'Anonymous';
    console.log("User Name:", userName);

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderBelongsToUser = 
      order.username === user.email || 
      order.username === user.mobile || 
      order.email === user.email ||
      (order.userId && order.userId.toString() === userId);

    if (!orderBelongsToUser) {
      return res.status(403).json({ message: 'Unauthorized to review this order' });
    }

    const productInOrder = order.cartItems.find(item => item.productId.toString() === productId);
    if (!productInOrder) {
      return res.status(400).json({ message: 'Product not found in this order' });
    }

    if (productInOrder.status !== 'Delivered') {
      return res.status(400).json({ message: 'You can only review delivered products' });
    }

    const existingReview = await Review.findOne({ userId, productId, orderId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const newReview = new Review({
      userId,
      productId,
      orderId,
      userName,
      rating,
      review
    });

    await newReview.save();

    res.status(201).json({ 
      message: 'Review added successfully', 
      review: newReview 
    });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
});

router.get('/api/reviews/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .select('userName rating review createdAt');

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    res.status(200).json({
      reviews,
      totalReviews,
      averageRating: parseFloat(averageRating),
      ratingDistribution
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

router.get('/api/reviews/check', authMiddleware, async (req, res) => {
  try {
    const { productId, orderId } = req.query;
    const userId = req.userId;

    const review = await Review.findOne({ userId, productId, orderId });

    res.status(200).json({ 
      hasReviewed: !!review,
      review: review || null
    });

  } catch (error) {
    console.error('Error checking review:', error);
    res.status(500).json({ message: 'Failed to check review' });
  }
});

router.get('/api/user/review-eligibility', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const User = require('../schema/user-schema');
    const user = await User.findById(userId).select('email mobile');

    const queryConditions = [{ userId }];
    if (user?.email) {
      queryConditions.push({ username: user.email });
      queryConditions.push({ email: user.email });
    }
    if (user?.mobile) {
      queryConditions.push({ username: user.mobile });
      queryConditions.push({ mobile: user.mobile });
    }

    const orders = await Order.find({ $or: queryConditions });

    const eligible = [];
    const reviewed = [];

    for (const order of orders) {
      for (const item of order.cartItems) {
        const productId = item.productId && item.productId._id ? item.productId._id : item.productId;
        if (!productId) continue;

        const isDelivered = (item.status === 'Delivered') || (order.status === 'Delivered');
        if (isDelivered) {
          const existing = await Review.findOne({ userId, productId, orderId: order._id });
          const key = `${productId}-${order._id}`;
          if (existing) reviewed.push({ productId: productId.toString(), orderId: order._id.toString(), key });
          else eligible.push({ productId: productId.toString(), orderId: order._id.toString(), key });
        }
      }
    }

    res.status(200).json({ eligible, reviewed });
  } catch (error) {
    console.error('Error fetching review eligibility:', error);
    res.status(500).json({ message: 'Failed to fetch review eligibility' });
  }
});

module.exports = router;
