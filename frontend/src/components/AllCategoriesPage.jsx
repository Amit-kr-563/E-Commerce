import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubcategories } from '../data/categories';
import Navbar from '../pages/Navbar';
import Productcard from "../pages/Productcard";
import { getAllProducts } from '../service/api';

export default function AllCategoriesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Check if we received category/subcategory from navigation
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
      if (location.state.subcategory && location.state.subcategory !== 'All') {
        setSelectedSubcategory(location.state.subcategory);
      } else {
        setSelectedSubcategory('All');
      }
    }
  }, [location]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'All') return true;
    if (selectedSubcategory === 'All') {
      return product.category === selectedCategory;
    }
    return product.category === selectedCategory && product.subcategory === selectedSubcategory;
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('All');
  };

  if (loading) {
    return (
      <>
        <Navbar/>
        <div style={{textAlign: 'center', padding: '50px'}}>
          <i className="fas fa-spinner fa-spin" style={{fontSize: '48px', color: '#ffe680'}}></i>
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar/>
      <div style={{margin: "2px 5vh 5px 5vh", width: "90%"}}>
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <h1 style={{fontSize: '36px', color: '#495057'}}>🛍️ All Categories</h1>
         
        </div>

       

        {selectedCategory !== 'All' && (
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            margin: '20px 0',
            padding: '15px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <button
              onClick={() => setSelectedSubcategory('All')}
              style={{
                padding: '8px 16px',
                border: '2px solid',
                borderColor: selectedSubcategory === 'All' ? '#000' : '#dee2e6',
                borderRadius: '20px',
                background: selectedSubcategory === 'All' ? '#ffe680' : 'white',
                color: '#000',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              All
            </button>
            
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
                    border: '2px solid',
                    borderColor: selectedSubcategory === sub ? '#000' : '#dee2e6',
                    borderRadius: '20px',
                    background: selectedSubcategory === sub ? '#ffe680' : 'white',
                    color: '#000',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {sub} ({count})
                </button>
              );
            })}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px'}}>
            <i className="fas fa-box-open" style={{fontSize: '64px', color: '#dee2e6', marginBottom: '20px'}}></i>
            <h3 style={{color: '#6c757d'}}>No products found in this category</h3>
            <p style={{color: '#adb5bd'}}>Try selecting a different category or subcategory</p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Productcard products={filteredProducts} />
          </div>
        )}
      </div>
    </>
  );
}
