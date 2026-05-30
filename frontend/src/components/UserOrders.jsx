import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserOrders.css';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All'); // All, Ordered, Dispatched, Delivered, Cancelled
  const [reviewModal, setReviewModal] = useState({ show: false, product: null, orderId: null });
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;
      
      console.log("=== FETCH USER ORDERS DEBUG ===");
      console.log("Token:", token ? "Present" : "Missing");
      console.log("User data:", loggedInUser?.user);
      
      const response = await axios.get('http://localhost:8000/api/user/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Orders received:", response.data.length);
      console.log("Orders data:", response.data);
      
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
      setLoading(false);
    }
  }, [navigate]);

  const checkReviewedProducts = useCallback(async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;
      
      console.log('=== CHECKING REVIEWED PRODUCTS ===');
      
      const response = await axios.get('http://localhost:8000/api/user/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Orders fetched:', response.data.length);
      
      const reviewed = new Set();
      for (const order of response.data) {
        console.log('Checking order:', order._id, 'status:', order.status);
        if (order.status === 'Delivered') {
          for (const item of order.cartItems) {
            console.log('  Item:', item.name, 'status:', item.status, 'productId:', item.productId);
            if (item.status === 'Delivered' && item.productId) {
              try {
                const productId = typeof item.productId === 'object' && item.productId !== null
                  ? item.productId._id 
                  : item.productId;
                
                console.log('  Extracted productId:', productId);
                
                if (productId) {
                  const reviewCheck = await axios.get(
                    `http://localhost:8000/api/reviews/check?productId=${productId}&orderId=${order._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  console.log('  Review check response:', reviewCheck.data);
                  if (reviewCheck.data.hasReviewed) {
                    const reviewKey = `${productId}-${order._id}`;
                    reviewed.add(reviewKey);
                    console.log('  Added to reviewed set:', reviewKey);
                  }
                }
              } catch (err) {
                console.error('Error checking review:', err);
              }
            }
          }
        }
      }
      console.log('Final reviewed products set:', Array.from(reviewed));
      setReviewedProducts(reviewed);
    } catch (error) {
      console.error('Error checking reviewed products:', error);
    }
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = loggedInUser?.token;
    
    if (!token) {
      navigate('/login');
      return;
    }

    fetchOrders();
    checkReviewedProducts();
  }, [navigate, fetchOrders, checkReviewedProducts]);

  const getFilteredOrders = () => {
    if (filter === 'All') return orders;
    
    return orders.map(order => ({
      ...order,
      cartItems: order.cartItems.filter(item => item.status === filter)
    })).filter(order => order.cartItems.length > 0);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Ordered': return 'status-ordered';
      case 'Dispatched': return 'status-dispatched';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Ordered': return '🛒';
      case 'Dispatched': return '📦';
      case 'Delivered': return '✅';
      case 'Cancelled': return '❌';
      default: return '📋';
    }
  };

  const openReviewModal = (item, orderId) => {
    setReviewModal({ 
      show: true, 
      product: item, 
      orderId: orderId 
    });
  };

  const closeReviewModal = () => {
    setReviewModal({ show: false, product: null, orderId: null });
  };

  const submitReview = async (rating, reviewText) => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;

      // Handle both cases: productId as string or as populated object
      const productId = typeof reviewModal.product.productId === 'object' && reviewModal.product.productId !== null
        ? reviewModal.product.productId._id 
        : reviewModal.product.productId;

      if (!productId) {
        alert('Product ID not found. Please try again.');
        return;
      }

      const reviewData = {
        productId: productId,
        orderId: reviewModal.orderId,
        rating,
        review: reviewText
      };

      console.log("=== SUBMITTING REVIEW ===");
      console.log("Review Data:", reviewData);
      console.log("Product Object:", reviewModal.product);
      console.log("Rating:", rating);
      console.log("Review Text:", reviewText);

      await axios.post(
        'http://localhost:8000/api/reviews',
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Review submitted successfully!');
      setReviewedProducts(prev => new Set([...prev, `${productId}-${reviewModal.orderId}`]));
      closeReviewModal();
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="user-orders-container">
      <div className="orders-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Home
        </button>
        <h1>📦 My Orders</h1>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All Orders
        </button>
        <button 
          className={`filter-btn ${filter === 'Ordered' ? 'active' : ''}`}
          onClick={() => setFilter('Ordered')}
        >
          🛒 Ordered
        </button>
        <button 
          className={`filter-btn ${filter === 'Dispatched' ? 'active' : ''}`}
          onClick={() => setFilter('Dispatched')}
        >
          📦 Dispatched
        </button>
        <button 
          className={`filter-btn ${filter === 'Delivered' ? 'active' : ''}`}
          onClick={() => setFilter('Delivered')}
        >
          ✅ Delivered
        </button>
        <button 
          className={`filter-btn ${filter === 'Cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('Cancelled')}
        >
          ❌ Cancelled
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No orders found</h2>
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/Shop')} className="shop-now-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header-info">
                <div className="order-id-section">
                  <h3>Order ID: {order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">
                    📅 {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="order-total-section">
                  <span className="total-label">Total Amount</span>
                  <h2 className="total-amount">₹{order.totalAmount?.toLocaleString()}</h2>
                </div>
              </div>

              <div className="delivery-details">
                <h4>📬 Delivery Details:</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{order.fullName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Mobile:</span>
                    <span className="detail-value">{order.mobile}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{order.email}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{order.address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment:</span>
                    <span className="detail-value">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="order-items">
                <h4>🛍️ Ordered Products:</h4>
                {order.cartItems.map((item, index) => {
                  // Debug logging
                  console.log('Item:', index, {
                    name: item.name,
                    status: item.status,
                    productId: item.productId,
                    hasProductId: !!item.productId
                  });
                  
                  return (
                  <div key={index} className="order-item">
                    <img src={item.img} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-price">₹{item.price} × {item.quantity}</p>
                      <p className="item-total">Total: ₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="item-status-section">
                      <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                        {getStatusIcon(item.status)} {item.status}
                      </span>
                      {item.status === 'Delivered' && (
                        <>
                          <p className="delivery-note">Delivered successfully!</p>
                          {(() => {
                            if (!item.productId) {
                              console.log('No productId for item:', item.name);
                              return null;
                            }
                            
                            const productId = typeof item.productId === 'object' && item.productId !== null
                              ? item.productId._id 
                              : item.productId;
                            
                            if (!productId) {
                              console.log('ProductId is null/undefined for item:', item.name);
                              return null;
                            }
                            
                            const reviewKey = `${productId}-${order._id}`;
                            const hasReviewed = reviewedProducts.has(reviewKey);
                            
                            console.log('Review check:', {
                              productId,
                              orderId: order._id,
                              reviewKey,
                              hasReviewed,
                              reviewedProductsSet: Array.from(reviewedProducts)
                            });
                            
                            return !hasReviewed ? (
                              <button 
                                className="review-btn"
                                onClick={() => openReviewModal(item, order._id)}
                              >
                                ⭐ Write a Review
                              </button>
                            ) : (
                              <span className="reviewed-badge">✓ Reviewed</span>
                            );
                          })()}
                        </>
                      )}
                      {item.status === 'Dispatched' && (
                        <p className="delivery-note">On the way to you!</p>
                      )}
                      {item.status === 'Ordered' && (
                        <p className="delivery-note">Being processed</p>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.show && (
        <ReviewModal 
          product={reviewModal.product}
          onClose={closeReviewModal}
          onSubmit={submitReview}
        />
      )}
    </div>
  );
}

// Review Modal Component
function ReviewModal({ product, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (reviewText.trim().length < 10) {
      alert('Please write a review of at least 10 characters');
      return;
    }
    onSubmit(rating, reviewText);
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h2>Write a Review</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="review-product-info">
          <img src={product.img} alt={product.name} />
          <h3>{product.name}</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rating-section">
            <label>Your Rating *</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-text">
              {rating > 0 && (
                rating === 5 ? 'Excellent!' :
                rating === 4 ? 'Good!' :
                rating === 3 ? 'Average' :
                rating === 2 ? 'Below Average' : 'Poor'
              )}
            </span>
          </div>

          <div className="review-text-section">
            <label>Your Review *</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              rows="5"
              required
            ></textarea>
            <small>{reviewText.length} characters (minimum 10)</small>
          </div>

          <div className="review-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserOrders;
