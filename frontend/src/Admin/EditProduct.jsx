import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllCategories, getCategoryIcon, getSubcategories } from '../data/categories';
import './ProductForm.css';

function EditProduct() {
  const [formData, setFormData] = useState({
    name: '',
    img: '',
    images: [],
    price: '',
    originalprice: '',
    category: 'Fashion & Apparel',
    subcategory: 'Men Clothing',
    description: '',
    stock: '',
    specifications: {}
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [enableSpecifications, setEnableSpecifications] = useState(false);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Calculate discount percentage
  const calculateDiscount = () => {
    const price = parseFloat(formData.price);
    const originalPrice = parseFloat(formData.originalprice);
    if (originalPrice && price && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;
      const response = await axios.get(`http://localhost:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({
        name: response.data.name,
        img: response.data.img,
        images: response.data.images || [],
        price: response.data.price,
        originalprice: response.data.originalprice,
        category: response.data.category || 'Fashion & Apparel',
        subcategory: response.data.subcategory || 'Men Clothing',
        description: response.data.description || '',
        stock: response.data.stock
      });
      setImagePreview(response.data.img);
      setAdditionalImages(response.data.images || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load product');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If category changes, reset subcategory to first option
    if (name === 'category') {
      const firstSubcategory = getSubcategories(value)[0];
      setFormData({
        ...formData,
        category: value,
        subcategory: firstSubcategory
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          img: reader.result
        });
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      img: url
    });
    if (url) {
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;
      const response = await axios.put(`http://localhost:8000/api/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(response.data.message);
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      <div className="product-form-wrapper">
        <div className="form-header">
          <h1>✏️ Edit Product</h1>
          <p>Update your product details</p>
        </div>
        
        {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i> {error}</div>}
        
        <form onSubmit={handleSubmit} className="product-form">
          {/* Image Upload Section */}
          <div className="image-upload-section">
            <div className="image-preview-container">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  <i className="fas fa-image"></i>
                  <p>Image Preview</p>
                </div>
              )}
            </div>
            
            <div className="image-upload-options">
              <div className="upload-option">
                <label className="file-upload-label">
                  <i className="fas fa-upload"></i> Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </label>
              </div>
              
              <div className="divider">
                <span>OR</span>
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-link"></i> Image URL
                </label>
                <input
                  type="text"
                  name="img"
                  value={formData.img}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.png"
                  className="url-input"
                />
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="form-section">
            <h3><i className="fas fa-box"></i> Product Information</h3>
            
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label><i className="fas fa-layer-group"></i> Main Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {getAllCategories().map(cat => (
                    <option key={cat} value={cat}>
                      {getCategoryIcon(cat)} {cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label><i className="fas fa-tag"></i> Sub Category *</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  required
                >
                  {getSubcategories(formData.category).map(sub => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label><i className="fas fa-align-left"></i> Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="form-section">
            <h3><i className="fas fa-rupee-sign"></i> Pricing Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Selling Price *</label>
                <div className="input-with-icon">
                  <span className="input-icon">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Original Price *</label>
                <div className="input-with-icon">
                  <span className="input-icon">₹</span>
                  <input
                    type="number"
                    name="originalprice"
                    value={formData.originalprice}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label><i className="fas fa-percentage"></i> Calculated Discount</label>
                <div className="discount-display">
                  <span className="discount-badge">
                    {calculateDiscount()}% OFF
                  </span>
                  <small>Auto-calculated based on prices</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/seller/dashboard')}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
