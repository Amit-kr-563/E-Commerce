

// // export default SellerOrders;
// import axios from 'axios';
// import { useCallback, useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './SellerOrders.css';

// function SellerOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [filter, setFilter] = useState(location.state?.filter || 'All');

//   const fetchOrders = useCallback(async () => {
//     try {
//       const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
//       const token = loggedInUser?.token;
//       const response = await axios.get('http://localhost:8000/api/seller/orders', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setOrders(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       if (error.response?.status === 401) {
//         localStorage.clear();
//         navigate('/login');
//       }
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
//     const token = loggedInUser?.token;
//     const userRole = loggedInUser?.user?.role;
    
//     if (!token || userRole !== 'seller') {
//       navigate('/login');
//       return;
//     }

//     fetchOrders();
//   }, [navigate, fetchOrders]);

//   // FIX: index ki jagah itemId use kar rahe hain taaki filter hone par bhi sahi item update ho
//   const updateOrderStatus = async (orderId, itemId, newStatus) => {
//     try {
//       const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
//       const token = loggedInUser?.token;
      
//       // Backend URL updated to use item id
//       await axios.put(
//         `http://localhost:8000/api/seller/order/${orderId}/item/${itemId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       alert(`Order status updated to ${newStatus}`);
//       fetchOrders(); 
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       alert(error.response?.data?.message || 'Failed to update order status');
//     }
//   };

//   const getFilteredOrders = () => {
//     if (filter === 'All') return orders;
    
//     return orders.map(order => ({
//       ...order,
//       cartItems: order.cartItems.filter(item => item.status === filter)
//     })).filter(order => order.cartItems.length > 0);
//   };

//   const getStatusBadgeClass = (status) => {
//     switch(status) {
//       case 'Ordered': return 'status-ordered';
//       case 'Dispatched': return 'status-dispatched';
//       case 'Delivered': return 'status-delivered';
//       default: return '';
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading orders...</div>;
//   }

//   const filteredOrders = getFilteredOrders();

//   return (
//     <div className="seller-orders-container">
//       <div className="orders-header">
//         <button onClick={() => navigate('/seller/dashboard')} className="back-btn">
//           ← Back to Dashboard
//         </button>
//         <h1>📦 My Orders</h1>
//       </div>

//       <div className="filter-buttons">
//         <button className={`filter-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All Orders</button>
//         <button className={`filter-btn ${filter === 'Ordered' ? 'active' : ''}`} onClick={() => setFilter('Ordered')}>🛒 Ordered</button>
//         <button className={`filter-btn ${filter === 'Dispatched' ? 'active' : ''}`} onClick={() => setFilter('Dispatched')}>📦 Dispatched</button>
//         <button className={`filter-btn ${filter === 'Delivered' ? 'active' : ''}`} onClick={() => setFilter('Delivered')}>✅ Delivered</button>
//       </div>

//       {filteredOrders.length === 0 ? (
//         <div className="no-orders">
//           <h2>No orders found</h2>
//           <p>You don't have any orders yet.</p>
//         </div>
//       ) : (
//         <div className="orders-list">
//           {filteredOrders.map((order) => (
//             <div key={order._id} className="order-card">
//               <div className="order-header">
//                 <div className="order-info">
//                   <h3>Order ID: {order._id.slice(-8).toUpperCase()}</h3>
//                   <p className="order-date">
//                     {new Date(order.createdAt).toLocaleDateString('en-IN', {
//                       year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
//                     })}
//                   </p>
//                 </div>
//                 <div className="order-total">
//                   <span>Order Total</span>
//                   <h2>₹{order.totalAmount?.toLocaleString() || order.orderTotal?.toLocaleString()}</h2>
//                 </div>
//               </div>

//               <div className="customer-details">
//                 <h4>Customer Details:</h4>
//                 <p><strong>Name:</strong> {order.fullName}</p>
//                 <p><strong>Email:</strong> {order.email}</p>
//                 <p><strong>Mobile:</strong> {order.mobile}</p>
//                 <p><strong>Address:</strong> {order.address}</p>
//                 <p><strong>Payment:</strong> {order.paymentMethod}</p>
//               </div>

//               <div className="order-items">
//                 <h4>Ordered Products:</h4>
//                 {order.cartItems.map((item) => (
//                   // Map mein key ke liye hamesha unique item._id use karein
//                   <div key={item._id || item.productId} className="order-item">
//                     <img src={item.img} alt={item.name} />
//                     <div className="item-details">
//                       <h4>{item.name}</h4>
//                       <p>Price: ₹{item.price} × {item.quantity}</p>
//                       <p className="item-total">Total: ₹{(item.price * item.quantity).toLocaleString()}</p>
//                     </div>
//                     <div className="item-status">
//                       <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
//                         {item.status}
//                       </span>
//                       <div className="status-actions">
//                         {item.status === 'Ordered' && (
//                           <button 
//                             onClick={() => updateOrderStatus(order._id, item._id, 'Dispatched')} // FIX: item._id bhej rahe hain
//                             className="action-btn dispatch-btn"
//                           >
//                             Mark as Dispatched
//                           </button>
//                         )}
//                         {item.status === 'Dispatched' && (
//                           <button 
//                             onClick={() => updateOrderStatus(order._id, item._id, 'Delivered')} // FIX: item._id bhej rahe hain
//                             className="action-btn deliver-btn"
//                           >
//                             Mark as Delivered
//                           </button>
//                         )}
//                         {item.status === 'Delivered' && (
//                           <span className="delivered-text">✅ Completed</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default SellerOrders;


import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// 1. SweetAlert2 ko import karein
import Swal from 'sweetalert2'; 
import './SellerOrders.css';

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [filter, setFilter] = useState(location.state?.filter || 'All');

  const fetchOrders = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = loggedInUser?.token;
    const userRole = loggedInUser?.user?.role;
    
    if (!token || userRole !== 'seller') {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate, fetchOrders]);

  // FIX: Status update hone par ab professional modern popup dikhega
  const updateOrderStatus = async (orderId, itemId, newStatus) => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;
      
      await axios.put(
        `http://localhost:8000/api/seller/order/${orderId}/item/${itemId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 2. Boring alert ki jagah SweetAlert2 Toast (Jo khud 2 second me gayab ho jayega)
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Order status changed to ${newStatus} successfully.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: '#fff',
        iconColor: '#2ec4b6'
      });

      fetchOrders(); 
    } catch (error) {
      console.error('Error updating order status:', error);
      
      // Error ke liye SweetAlert2 Error Box
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Failed to update order status',
        confirmButtonColor: '#e71d36'
      });
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

      <div className="filter-buttons">
        <button className={`filter-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All Orders</button>
        <button className={`filter-btn ${filter === 'Ordered' ? 'active' : ''}`} onClick={() => setFilter('Ordered')}>🛒 Ordered</button>
        <button className={`filter-btn ${filter === 'Dispatched' ? 'active' : ''}`} onClick={() => setFilter('Dispatched')}>📦 Dispatched</button>
        <button className={`filter-btn ${filter === 'Delivered' ? 'active' : ''}`} onClick={() => setFilter('Delivered')}>✅ Delivered</button>
      </div>

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
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="order-total">
                  <span>Order Total</span>
                  <h2>₹{order.totalAmount?.toLocaleString() || order.orderTotal?.toLocaleString()}</h2>
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
                {order.cartItems.map((item) => (
                  <div key={item._id || item.productId} className="order-item">
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
                            onClick={() => updateOrderStatus(order._id, item._id, 'Dispatched')} 
                            className="action-btn dispatch-btn"
                          >
                            Mark as Dispatched
                          </button>
                        )}
                        {item.status === 'Dispatched' && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, item._id, 'Delivered')} 
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