
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import { useCart } from "../components/cartContext";
import { getProductById, getProductReviews, checkReview, submitReview } from "../service/api";
import { API_BASE_URL } from '../config';
import "./Productdetail.css";

export default function Productcarddetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [eligibleOrderId, setEligibleOrderId] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  // ---------------- FETCH PRODUCT ----------------
  const fetchProduct = useCallback(async () => {
    try {
      const response = await getProductById(id);
      setProduct(response.data);
      setSelectedImage(response.data.img);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  }, [id]);

  // ---------------- FETCH REVIEWS ----------------
  const fetchReviews = useCallback(async () => {
    try {
      const response = await getProductReviews(id);
      setReviews(response.data.reviews);
      setReviewStats({
        averageRating: response.data.averageRating,
        totalReviews: response.data.totalReviews,
        ratingDistribution: response.data.ratingDistribution
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [id]);

  // ---------------- EFFECT ----------------
  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  // ---------------- CHECK REVIEW ELIGIBILITY ----------------
  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const token = loggedInUser?.token;
        if (!token || !product) return;

        const ordersRes = await axios.get(`${API_BASE_URL}/api/user/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        for (const order of ordersRes.data) {
          for (const item of order.cartItems) {
            const productId = typeof item.productId === 'object' && item.productId !== null
              ? item.productId._id
              : item.productId;
            if (!productId) continue;
            if (productId.toString() === product._id.toString() && item.status === 'Delivered') {
              const checkRes = await checkReview(productId, order._id);
              if (checkRes.data.hasReviewed) {
                setHasReviewed(true);
                setEligibleOrderId(null);
              } else {
                setEligibleOrderId(order._id);
                setHasReviewed(false);
                return;
              }
            }
          }
        }
        setEligibleOrderId(null);
      } catch (err) {
        console.error('Error checking review eligibility:', err);
      }
    };
    checkEligibility();
  }, [product]);

  // ---------------- CLOTHING CHECK ----------------
  const isClothingProduct = (p) => {
    if (!p) return false;
    const category = (p.category || '').toLowerCase();
    const subcategory = (p.subcategory || '').toLowerCase();

    const nonClothingCategories = [
      'electronics', 'appliances', 'home', 'kitchen', 'sports', 'toys',
      'books', 'health', 'beauty', 'automotive', 'tools', 'grocery',
      'furniture', 'garden', 'pet', 'office', 'music', 'gaming'
    ];

    if (nonClothingCategories.some(cat => category.includes(cat))) {
      return false;
    }

    const clothingCategories = ['fashion', 'apparel', 'clothing', 'wear'];
    const clothingKeywords = [
      'shirt', 't-shirt', 'tshirt', 'dress', 'jeans', 'pant', 'trouser',
      'kurta', 'top', 'bottom', 'shorts', 'skirt', 'saree', 'hoodie',
      'jacket', 'coat', 'sweater', 'underwear', 'bra', 'blazer', 'suit',
      'lehenga', 'kurti', 'salwar', 'kameez', 'sherwani', 'dupatta'
    ];
    const footwearKeywords = ['shoe', 'shoes', 'footwear', 'sneaker', 'sandals', 'heels', 'boots', 'slipper'];

    const text = `${category} ${subcategory} ${p.name || ''}`.toLowerCase();
    if (footwearKeywords.some(k => text.includes(k))) return false;

    const isClothingCategory = clothingCategories.some(cat => category.includes(cat));
    const hasClothingKeywords = clothingKeywords.some(k => text.includes(k));

    return isClothingCategory || hasClothingKeywords;
  };

  // ---------------- MODERN SPINNER LOADING ----------------
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: '15px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h3 style={{ color: '#555', fontFamily: 'sans-serif', fontWeight: '500' }}>Loading Product Details...</h3>
        
        {/* Injecting keyframe animation inline securely */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!product) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Product Not Found</h2>;

  // ---------------- BUY NOW ----------------
  const handleBuyNow = () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"))?.user;

    if (!user) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Please login first',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      navigate("/login");
      return;
    }

    const cartItems = [{
      _id: product._id,
      sellerId: product.seller,
      name: product.name,
      img: product.img,
      price: product.price,
      quantity: 1
    }];

    navigate("/checkout", {
      state: { cartItems, totalAmount: product.price, user }
    });
  };

  // ---------------- STAR RENDER ----------------
  function renderStars(rating) {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`f-${i}`} className="star star-full">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star star-half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`e-${i}`} className="star star-empty">★</span>);
    }
    return stars;
  }

  const discountLabel = product?.discount
    ? product.discount
    : (product?.originalprice && Number(product.originalprice) > Number(product.price))
      ? `${Math.round(((Number(product.originalprice) - Number(product.price)) / Number(product.originalprice)) * 100)}% off`
      : null;

  // ---------------- UI ----------------
  return (
    <>
      <div className="product-detail-container">
        <div className="image-section">
          <div className="main-image-container">
            <img
              src={selectedImage || product.img}
              alt={product.name}
              className="main-image"
            />
          </div>
        </div>

        <div className="info-section">
          <h2>{product.name}</h2>

          <p className="price">
            <span className="new-price">₹{product.price}</span>
            {product.originalprice && (
              <span className="old-price">₹{product.originalprice}</span>
            )}
            {discountLabel && (
              <span className="discount">{discountLabel}</span>
            )}
          </p>

          {product.description && (
            <p className="description">{product.description}</p>
          )}

          <div className="details">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Subcategory:</strong> {product.subcategory}</p>

            {/* Write review CTA for eligible users */}
            {eligibleOrderId && !hasReviewed && (
              <div style={{ marginTop: 12 }}>
                <button className="add-to-cart" onClick={() => setShowReviewModal(true)}>⭐ Write a Review</button>
              </div>
            )}

            {isClothingProduct(product) && (
              <>
                <label><strong>Size:</strong></label>
                <select defaultValue="M">
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </>
            )}
          </div>

          <div className="actions">
            <button className="add-to-cart" onClick={() => addToCart(product)}>Add to Cart</button>
            <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      {(reviewStats && reviewStats.totalReviews > 0) || (!reviewStats || reviewStats.totalReviews === 0) ? (
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          <div>
            <span>{(reviewStats?.averageRating || 0).toFixed(1)}</span>
            <div>{renderStars(reviewStats?.averageRating || 0)}</div>
            <span>{reviewStats?.totalReviews || 0} reviews</span>
          </div>

          {reviews.length === 0 && (
            <p style={{ color: '#666' }}>No reviews yet. Be the first to review this product!</p>
          )}

          {reviews.map((review) => (
            <div key={review._id}>
              <p>{review.userName}</p>
              <div>{renderStars(review.rating)}</div>
              <p>{review.review}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Review Modal (inline) */}
      {showReviewModal && (
        <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <h2>Write a Review</h2>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="review-product-info" style={{ padding: 20 }}>
              <img src={product.img} alt={product.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
              <h3>{product.name}</h3>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              // Native alerts replaced with Toast/Alert from SweetAlert2
              if (rating === 0) { 
                Swal.fire({ icon: 'warning', title: 'Rating Required', text: 'Please select a star rating.' }); 
                return; 
              }
              if (reviewText.trim().length < 10) { 
                Swal.fire({ icon: 'warning', title: 'Review Too Short', text: 'Please write a review with at least 10 characters.' }); 
                return; 
              }
              
              try {
                await submitReview({ productId: product._id, orderId: eligibleOrderId, rating, review: reviewText });
                
                // Success SweetAlert
                Swal.fire({
                  icon: 'success',
                  title: 'Thank You!',
                  text: 'Review submitted successfully',
                  timer: 2500,
                  showConfirmButton: false
                });

                setShowReviewModal(false);
                setReviewText(''); 
                setRating(0);
                fetchReviews();
                setHasReviewed(true);
              } catch (err) {
                console.error('Submit review error:', err);
                
                // Error SweetAlert
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: err.response?.data?.message || 'Failed to submit review'
                });
              }
            }}>
              <div className="rating-section" style={{ padding: 20 }}>
                <label>Your Rating *</label>
                <div className="star-rating">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>★</span>
                  ))}
                </div>
              </div>
              <div className="review-text-section" style={{ padding: 20 }}>
                <label>Your Review *</label>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience..." rows={5} required></textarea>
                <small>{reviewText.length} characters (minimum 10)</small>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', padding: 20 }}>
                <button type="button" className="cancel-btn" onClick={() => setShowReviewModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}