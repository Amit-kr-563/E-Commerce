

import { useNavigate } from 'react-router-dom';
import { useCart, useWatchlist } from "../service/api";
import "./Productcard.css";

export default function Productcard({ products = [] }) {
  const { addToCart } = useCart();
  const { addToWatchlist } = useWatchlist();
  const navigate = useNavigate();

  return (
    <div className="featured-items">
      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card" key={item._id || item.id}>
            <div className="watchlist">

              <button className="cart-btn1" onClick={() => addToWatchlist(item)}>
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" />
              </button>
            </div>
            <div className="product-image">
              <img src={item.img} className="main-img" alt={item.name} />
              <img src={item.img} className="hover-img" alt={`${item.name} Hover`} />
              <button className="cart-btn" onClick={() => addToCart(item)}>
                <i className="fas fa-shopping-cart"></i>
              </button>
            </div>
            <div className="product-info">
              <h4>{item.name}</h4>
              <p>
                <span className="price">₹{item.price}</span>
                <span className="original-price">₹{item.originalprice}</span>
                <span className="discount1">{item.discount}</span>
              </p>
              <button
                className="hot-deal"
                onClick={() => navigate(`/product/${item._id || item.id}`)}
              >
                Show more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
