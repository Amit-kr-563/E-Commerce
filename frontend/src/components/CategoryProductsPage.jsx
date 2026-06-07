import { useEffect, useState } from 'react';
import Navbar from '../pages/Navbar';
import Productcard from '../pages/Productcard';
import { getAllProducts } from '../service/api';

const normalize = (value) => String(value || '').trim().toLowerCase();

// Strict matching: prefer subcategory when present (e.g. "Men Clothing" → Men page only).
const matchesCategory = (product, category) => {
  const prodSub = normalize(product.subcategory);
  const prodCat = normalize(product.category);
  const target = normalize(category);

  // If a subcategory exists, use it to decide strictly
  if (prodSub) {
    if (target === 'men' && prodSub.includes('men')) return true;
    if (target === 'women' && prodSub.includes('women')) return true;
    if (target === 'kids' && (prodSub.includes('kid') || prodSub.includes('baby'))) return true;
    return false; // subcategory present but does not match the requested page
  }

  // Fallback to category matching (exact or contains)
  if (prodCat === target) return true;
  if (prodCat.includes(target)) return true;

  // Allow legacy cases where category was set to 'fashion & apparel' without subcategory — do not show on specific pages
  return false;
};

export default function CategoryProductsPage({ category, title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllProducts();
        const filteredProducts = (response.data || []).filter((product) => matchesCategory(product, category));
        setProducts(filteredProducts);
      } catch (error) {
        console.error(`Error fetching ${category} products:`, error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    /* Global Wrapper: Jo screen ko left-right hilne se 100% rokega */
    <div style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}>
      <Navbar />
      
      {/* Container: Jo desktop par margin manage karega aur mobile par automatic adjust hoga */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1240px', 
        margin: '0 auto', 
        padding: '24px 16px', 
        boxSizing: 'border-box' 
      }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ 
            fontSize: 'clamp(24px, 5vw, 36px)', /* Responsive font: mobile par chota, desktop par bada */
            fontWeight: '800', 
            color: '#1e293b',
            margin: '0',
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h2>
        </div>

        {/* Dynamic Content Rendering */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', boxSizing: 'border-box' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '44px', color: '#ffe680', marginBottom: '16px' }}></i>
            <h2 style={{ color: '#475569', fontSize: '18px' }}>Loading products...</h2>
          </div>
        ) : products.length > 0 ? (
          /* Elastic Container wrapping your Custom Card View Layer */
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            boxSizing: 'border-box' 
          }}>
            <Productcard products={products} />
          </div>
        ) : (
          /* Empty State View */
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: '#ffffff', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0',
            boxSizing: 'border-box'
          }}>
            <i className="fas fa-box-open" style={{ fontSize: '54px', color: '#cbd5e1', marginBottom: '16px' }}></i>
            <h3 style={{ color: '#475569', fontSize: '18px', fontWeight: '600', margin: '0' }}>
              No products found in this category.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}