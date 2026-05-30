import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './userinfo.css';

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [orderAnalytics, setOrderAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = loggedInUser?.token;
    const userRole = loggedInUser?.user?.role;
    
    if (!token || userRole !== 'seller') {
      navigate('/login');
      return;
    }

    fetchSellerData();
  }, [navigate]);

  const fetchSellerData = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch products and analytics first
      const [productsRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/seller/products', config),
        axios.get('http://localhost:8000/api/seller/analytics', config)
      ]);

      setProducts(productsRes.data);
      setAnalytics(analyticsRes.data);

      // Fetch order analytics separately with error handling
      try {
        const orderAnalyticsRes = await axios.get('http://localhost:8000/api/seller/order-analytics', config);
        setOrderAnalytics(orderAnalyticsRes.data);
      } catch (orderError) {
        console.error('Error fetching order analytics:', orderError);
        // Set default values if order analytics fails
        setOrderAnalytics({
          totalOrders: 0,
          orderedCount: 0,
          dispatchedCount: 0,
          deliveredCount: 0,
          totalRevenue: 0
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching seller data:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const token = loggedInUser?.token;
        await axios.delete(`http://localhost:8000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product deleted successfully');
        fetchSellerData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getSellerInfo = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser?.user;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/seller/add-product')} className="add-btn">
            Add New Product
          </button>
          <div className="profile-menu">
            <button className="profile-btn" onClick={() => navigate('/userinfo')}>
              <div className="profile-avatar">
                <i className="fas fa-user"></i>
              </div>
              <span className="profile-name">{getSellerInfo()?.name || 'Profile'}</span>
            </button>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-container">
        {/* Product Analytics */}
        {analytics && (
          <div className="analytics-section">
            <h2>📦 Product Analytics</h2>
            <div className="analytics-cards">
              <div className="analytics-card">
                <h3>Total Products</h3>
                <p className="analytics-value">{analytics.totalProducts}</p>
              </div>
              <div className="analytics-card">
                <h3>Total Stock</h3>
                <p className="analytics-value">{analytics.totalStock}</p>
              </div>
              <div className="analytics-card">
                <h3>Total Value</h3>
                <p className="analytics-value">₹{analytics.totalValue?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Analytics */}
        {orderAnalytics && (
          <div className="analytics-section">
            <h2>📊 Order Analytics</h2>
            <div className="analytics-cards">
              <div 
                className="analytics-card order-card clickable"
                onClick={() => navigate('/seller/orders', { state: { filter: 'All' } })}
              >
                <h3>Total Orders</h3>
                <p className="analytics-value">{orderAnalytics.totalOrders}</p>
              </div>
              <div 
                className="analytics-card ordered-card clickable"
                onClick={() => navigate('/seller/orders', { state: { filter: 'Ordered' } })}
              >
                <h3>🛒 Ordered</h3>
                <p className="analytics-value">{orderAnalytics.orderedCount}</p>
              </div>
              <div 
                className="analytics-card dispatched-card clickable"
                onClick={() => navigate('/seller/orders', { state: { filter: 'Dispatched' } })}
              >
                <h3>📦 Dispatched</h3>
                <p className="analytics-value">{orderAnalytics.dispatchedCount}</p>
              </div>
              <div 
                className="analytics-card delivered-card clickable"
                onClick={() => navigate('/seller/orders', { state: { filter: 'Delivered' } })}
              >
                <h3>✅ Delivered</h3>
                <p className="analytics-value">{orderAnalytics.deliveredCount}</p>
              </div>
              <div 
                className="analytics-card revenue-card clickable"
                onClick={() => navigate('/seller/orders', { state: { filter: 'All' } })}
              >
                <h3>💰 Total Revenue</h3>
                <p className="analytics-value">₹{orderAnalytics.totalRevenue?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 My Products
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📋 Orders
        </button>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'products' ? (
        <div className="products-section">
          {products.length === 0 ? (
            <p className="no-products">No products added yet. Add your first product!</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <img src={product.img} alt={product.name} />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="category">{product.category}</p>
                    <div className="price-section">
                      <span className="price">₹{product.price}</span>
                      <span className="original-price">₹{product.originalprice}</span>
                      <span className="discount">{product.discount}</span>
                    </div>
                    <p className="stock">Stock: {product.stock}</p>
                    <div className="product-actions">
                      <button 
                        onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="orders-section">
          <button 
            className="view-orders-btn"
            onClick={() => navigate('/seller/orders')}
          >
            📋 View All Orders Details
          </button>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
