import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, getCategoryIcon, getSubcategories } from '../data/categories';
import './ProductForm.css';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    img: '',
    images: [], // Additional images
    price: '',
    originalprice: '',
    category: 'Fashion & Apparel',
    subcategory: 'Men Clothing',
    description: '',
    stock: '',
    specifications: {}
  });

  // Calculate discount percentage
  const calculateDiscount = () => {
    const price = parseFloat(formData.price);
    const originalPrice = parseFloat(formData.originalprice);
    if (originalPrice && price && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]); // Preview for additional images
  const [enableSpecifications, setEnableSpecifications] = useState(false);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
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

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 10) {
      setError('You can upload maximum 10 additional images');
      return;
    }
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were invalid (not images or too large)');
    }

    const imagePromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setAdditionalImages(images);
      setFormData({
        ...formData,
        images: images
      });
      setError('');
    });
  };

  const removeAdditionalImage = (index) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const addSpecificationField = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecificationField = (index) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
    
    // Update formData with valid specifications
    const validSpecs = {};
    newSpecs.forEach(spec => {
      if (spec.key.trim() && spec.value.trim()) {
        validSpecs[spec.key.trim()] = spec.value.trim();
      }
    });
    setFormData({
      ...formData,
      specifications: validSpecs
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser?.token;
      
      // Prepare data with specifications if enabled
      const dataToSubmit = { ...formData };
      if (!enableSpecifications) {
        dataToSubmit.specifications = {};
      }
      
      console.log('Submitting product data:', dataToSubmit);
      const response = await axios.post('http://localhost:8000/api/products', dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(response.data.message);
      navigate('/seller/dashboard');
    } catch (err) {
      console.error('Error adding product:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-wrapper">
        <div className="form-header">
          <h1>✨ Add New Product</h1>
          <p>Fill in the details to add a new product to your store</p>
        </div>
        
        {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i> {error}</div>}
        
        <form onSubmit={handleSubmit} className="product-form">
          {/* Main Image Upload Section */}
          <div className="image-upload-section">
            <h3><i className="fas fa-image"></i> Main Product Image (Front Image) *</h3>
            <div className="image-preview-container">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  <i className="fas fa-image"></i>
                  <p>Main Image Preview</p>
                </div>
              )}
            </div>
            
            <div className="image-upload-options">
              <div className="upload-option">
                <label className="file-upload-label">
                  <i className="fas fa-upload"></i> Upload Main Image
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
                  <i className="fas fa-link"></i> Main Image URL
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

          {/* Additional Images Upload Section */}
          <div className="image-upload-section additional-images-section">
            <h3><i className="fas fa-images"></i> Additional Product Images (Optional)</h3>
            <p className="helper-text">Upload up to 10 additional images to showcase your product from different angles</p>
            
            <div className="upload-option">
              <label className="file-upload-label">
                <i className="fas fa-upload"></i> Upload Additional Images (Max 10)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="file-input"
                />
              </label>
            </div>

            {additionalImages.length > 0 && (
              <div className="additional-images-preview">
                {additionalImages.map((img, index) => (
                  <div key={index} className="additional-image-item">
                    <img src={img} alt={`Additional ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeAdditionalImage(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          {/* Specifications Section */}
          <div className="form-section specifications-section">
            <div className="section-header-with-toggle">
              <h3><i className="fas fa-list-ul"></i> Product Specifications (Optional)</h3>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={enableSpecifications}
                  onChange={(e) => setEnableSpecifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <p className="helper-text">Add detailed specifications like Brand, Material, Size, Weight, etc.</p>

            {enableSpecifications && (
              <div className="specifications-container">
                {specifications.map((spec, index) => (
                  <div key={index} className="specification-row">
                    <input
                      type="text"
                      placeholder="Specification Name (e.g., Brand)"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      className="spec-key-input"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Nike)"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      className="spec-value-input"
                    />
                    {specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecificationField(index)}
                        className="remove-spec-btn"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecificationField}
                  className="add-spec-btn"
                >
                  <i className="fas fa-plus"></i> Add More Specification
                </button>
              </div>
            )}
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
                  <i className="fas fa-spinner fa-spin"></i> Adding...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
