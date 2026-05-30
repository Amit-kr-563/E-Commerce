import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SellerOrders.css';

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get filter from navigation state or default to 'All'
  const [filter, setFilter] = useState(location.state?.filter || 'All'); // All, Ordered, Dispatched, Delivered

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = loggedInUser?.token;
    const userRole = loggedInUser?.user?.role;
    
    if (!token || userRole !== 'seller') {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;
      const response = await axios.get('http://localhost:8000/api/seller/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const updateOrderStatus = async (orderId, itemIndex, newStatus) => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;
      await axios.put(
        `http://localhost:8000/api/seller/order/${orderId}/item/${itemIndex}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

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
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="seller-orders-container">
      <div className="orders-header">
        <button onClick={() => navigate('/seller/dashboard')} className="back-btn">
          ← Back to Dashboard
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
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders found</h2>
          <p>You don't have any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order ID: {order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="order-total">
                  <span>Order Total</span>
                  <h2>₹{order.orderTotal?.toLocaleString()}</h2>
                </div>
              </div>

              <div className="customer-details">
                <h4>Customer Details:</h4>
                <p><strong>Name:</strong> {order.fullName}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Mobile:</strong> {order.mobile}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
              </div>

              <div className="order-items">
                <h4>Ordered Products:</h4>
                {order.cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.img} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Price: ₹{item.price} × {item.quantity}</p>
                      <p className="item-total">Total: ₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="item-status">
                      <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                      <div className="status-actions">
                        {item.status === 'Ordered' && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, index, 'Dispatched')}
                            className="action-btn dispatch-btn"
                          >
                            Mark as Dispatched
                          </button>
                        )}
                        {item.status === 'Dispatched' && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, index, 'Delivered')}
                            className="action-btn deliver-btn"
                          >
                            Mark as Delivered
                          </button>
                        )}
                        {item.status === 'Delivered' && (
                          <span className="delivered-text">✅ Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerOrders;
