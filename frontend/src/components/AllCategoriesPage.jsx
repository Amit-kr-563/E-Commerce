import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getSubcategories } from '../data/categories';
import Navbar from '../pages/Navbar';
import Productcard from "../pages/Productcard";
import { getAllProducts } from '../service/api';

export default function AllCategoriesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const location = useLocation();

  // Wrapped fetchProducts with useCallback to ensure standard dependency arrays
  const fetchProducts = useCallback(async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
      if (location.state.subcategory && location.state.subcategory !== 'All') {
        setSelectedSubcategory(location.state.subcategory);
      } else {
        setSelectedSubcategory('All');
      }
    }
  }, [location]);

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'All') return true;
    if (selectedSubcategory === 'All') {
      return product.category === selectedCategory;
    }
    return product.category === selectedCategory && product.subcategory === selectedSubcategory;
  });

  if (loading) {
    return (
      <div style={{ width: '100vw', overflowX: 'hidden' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 20px', boxSizing: 'border-box' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#ffe680', marginBottom: '16px' }}></i>
          <h2 style={{ color: '#495057', fontSize: '20px' }}>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    /* Global Page Wrapper - Prevents side-to-side page shaking/overflow completely */
    <div style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}>
      <Navbar />

      {/* Main Responsive Layout Wrapper */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1240px', 
        margin: '0 auto', 
        padding: '24px 16px', 
        boxSizing: 'border-box' 
      }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: 'clamp(24px, 5vw, 36px)', /* Auto resizes beautifully from mobile to desktop */
            fontWeight: '800',
            color: '#1e293b', 
            letterSpacing: '-0.02em',
            margin: '0'
          }}>
            🛍️ All Categories
          </h1>
        </div>

        {/* Subcategories Filter Chips Group */}
        {selectedCategory !== 'All' && (
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            margin: '0 auto 28px auto',
            padding: '12px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9',
            boxSizing: 'border-box',
            maxWidth: '100%'
          }}>
            
            {/* 'All' Selection Chip */}
            <button
              onClick={() => setSelectedSubcategory('All')}
              style={{
                padding: '8px 16px',
                border: selectedSubcategory === 'All' ? '1px solid #000' : '1px solid #e2e8f0',
                borderRadius: '20px',
                background: selectedSubcategory === 'All' ? '#ffe680' : 'white',
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedSubcategory === 'All' ? '0 4px 10px rgba(255, 230, 128, 0.3)' : 'none'
              }}
            >
              All
            </button>
            
            {/* Dynamic Map Subcategories Buttons */}
            {getSubcategories(selectedCategory).map(sub => {
              const count = products.filter(p => 
                p.category === selectedCategory && p.subcategory === sub
              ).length;
              
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  style={{
                    padding: '8px 16px',
                    border: selectedSubcategory === sub ? '1px solid #000' : '1px solid #e2e8f0',
                    borderRadius: '20px',
                    background: selectedSubcategory === sub ? '#ffe680' : 'white',
                    color: '#0f172a',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedSubcategory === sub ? '0 4px 10px rgba(255, 230, 128, 0.3)' : 'none',
                    whiteSpace: 'nowrap' /* Stops text wrapping inside individual chips on phones */
                  }}
                >
                  {sub} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Products Grid Control Grid / Fallback UI */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center', 
            padding: '60px 20px', 
            background: '#ffffff', 
            borderRadius: '16px', 
            border: '1px solid #f1f5f9',
            boxSizing: 'border-box'
          }}>
            <i className="fas fa-box-open" style={{ fontSize: '54px', color: '#cbd5e1', marginBottom: '16px' }}></i>
            <h3 style={{ color: '#475569', fontSize: '18px', fontWeight: '600', margin: '0 0 6px 0' }}>No products found in this category</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0' }}>Try selecting a different category or subcategory</p>
          </div>
        ) : (
          /* Safe Elastic Container wrapping your Custom Card View Layer */
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            boxSizing: 'border-box' 
          }}>
            <Productcard products={filteredProducts} />
          </div>
        )}
      </div>
    </div>
  );
}