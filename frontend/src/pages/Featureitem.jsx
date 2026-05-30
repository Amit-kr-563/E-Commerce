
import { useEffect, useState } from 'react';
import { getAllCategories, getCategoryIcon } from "../data/categories";
import { getRandomProducts } from "../service/api";
import "./Featureitem.css";
import Productcard from "./Productcard";

export default function Featureitem() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomProducts();
  }, []);

  const fetchRandomProducts = async () => {
    try {
      const response = await getRandomProducts(24); // Fetch 24 random products
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="feature-container" style={{textAlign: 'center', padding: '50px'}}>
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin" style={{fontSize: '48px', color: '#667eea'}}></i>
          <h2>Loading Amazing Products...</h2>
        </div>
      </div>
    );
  }

  // Display first 12 random products
  const displayProducts = products.slice(0, 12);

  return (
    <div className="feature-container">
       <div className="feature-header-section">
              <div className="header">
                  <h2>Feature Items</h2>
              </div>
          </div>
          
     <div className="product-section">
        <Productcard products={displayProducts} />
      </div>

      <div className="view-all-section" style={{
        textAlign: 'center',
        margin: '30px 0 20px 0',
        padding: '15px'
      }}>
        <a href="/Shop" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '15px 30px',
          background: '#2ecc71',
          color: 'white',
          borderRadius: '10px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s'
        }}>
          <i className="fas fa-th"></i> View All Products
        </a>
      </div>
    </div>
  );
}

