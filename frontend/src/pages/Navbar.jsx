
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../Assets/Slider/logo.png";
import { getAllCategories, getCategoryIcon, getSubcategories } from '../data/categories';
import { getAllProducts } from "../service/api";
import "./Navbar.css";

import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover
} from "@mui/material";

function Navbar() {
  const [searchName, setSearchName] = useState("");
  const [products, setProducts] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchProducts();
  //   const userData = checkUserLogin();
  //   fetchCartCount(userData);
  // }, []);

  useEffect(() => {
  fetchProducts();
  const userData = checkUserLogin();
  fetchCartCount(userData);

// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const checkUserLogin = () => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(userData);
    return userData;
  };

  const getUsername = (userData) => {
    return userData?.user?.email || userData?.user?.mobile;
  };

  const fetchCartCount = async (userData = null) => {
    const activeUserData = userData || JSON.parse(localStorage.getItem("loggedInUser"));
    const username = getUsername(activeUserData);

    if (!username) {
      setCartCount(0);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/cart/${username}`);
      const count = Array.isArray(response.data)
        ? response.data.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
        : 0;
      setCartCount(count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };


  useEffect(() => {
  const handleCartUpdated = () => {
    fetchCartCount();
  };

  const handleStorageChange = (event) => {
    if (event.key === "loggedInUser") {
      const userData = checkUserLogin();
      fetchCartCount(userData);
    }
  };

  window.addEventListener("cart-updated", handleCartUpdated);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("cart-updated", handleCartUpdated);
    window.removeEventListener("storage", handleStorageChange);
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const normalizeText = (value = "") =>
    String(value)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

  const buildSuggestions = (query) => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return [];

    const ranked = products
      .map((product) => {
        const productName = normalizeText(product?.name || "");
        const category = normalizeText(product?.category || "");
        const subcategory = normalizeText(product?.subcategory || "");

        let score = 0;
        if (productName === normalizedQuery) score = 100;
        else if (productName.startsWith(normalizedQuery)) score = 90;
        else if (productName.includes(normalizedQuery)) score = 80;
        else if (category.includes(normalizedQuery)) score = 60;
        else if (subcategory.includes(normalizedQuery)) score = 50;

        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.product);

    return ranked;
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchName(value);

    const suggestions = buildSuggestions(value);
    setSearchSuggestions(suggestions);
    setShowSuggestions(Boolean(value.trim()) && suggestions.length > 0);
  };

  const handleSuggestionSelect = (product) => {
    if (!product?._id) return;
    setSearchName(product.name || "");
    setShowSuggestions(false);
    navigate(`/product/${product._id}`);
  };

  const handleSearch = (forcedValue) => {
    const valueToSearch = forcedValue ?? searchName;
    const normalizedQuery = normalizeText(valueToSearch);

    if (!normalizedQuery) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'info',
        title: 'Type product name to search',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true
      });
      return;
    }

    const suggestions = buildSuggestions(valueToSearch);
    const matchedProduct = suggestions[0];

    if (matchedProduct?._id) {
      setShowSuggestions(false);
      navigate(`/product/${matchedProduct._id}`);
      return;
    }

    const matchingCategoryProduct = products.find(
      (product) => normalizeText(product.category) === normalizedQuery
    );

    if (matchingCategoryProduct) {
      setShowSuggestions(false);
      navigate('/Shop', { state: { category: matchingCategoryProduct.category, subcategory: 'All' } });
      return;
    }

    const matchingSubcategoryProduct = products.find(
      (product) => normalizeText(product.subcategory) === normalizedQuery
    );

    if (matchingSubcategoryProduct) {
      setShowSuggestions(false);
      navigate('/Shop', {
        state: {
          category: matchingSubcategoryProduct.category,
          subcategory: matchingSubcategoryProduct.subcategory,
        },
      });
    } else {
      setShowSuggestions(false);
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Product not found!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }
  };

  // Popover logic
  const [anchorEl, setAnchorEl] = useState(null);
  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const handleOptionClick = (path) => {
    navigate(path);
    handleClose();
  };

  // Category dropdown logic
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categoryOpen = Boolean(categoryAnchor);

  const handleCategoryClick = (event) => {
    const category = event.currentTarget.getAttribute('data-category');
    setSelectedCategory(category);
    setCategoryAnchor(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setCategoryAnchor(null);
    setSelectedCategory(null);
  };

  const handleSubcategoryClick = (category, subcategory) => {
    navigate('/Shop', { state: { category, subcategory } });
    handleCategoryClose();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar1">
          <div className="logo"><img src={logo} alt="SudoCart Logo" /><h1>SudoCart</h1> </div>
<div className="search1"></div>
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by product, category, subcategory"
                value={searchName}
                onChange={handleSearchInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                onFocus={() => {
                  if (searchSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
              />
              <button onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </button>
            </div>

            {showSuggestions && (
              <div className="search-suggestions">
                {searchSuggestions.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    className="search-suggestion-item"
                    onMouseDown={() => handleSuggestionSelect(product)}
                  >
                    <span className="suggestion-name">{product.name}</span>
                    <span className="suggestion-meta">
                      {product.category} / {product.subcategory}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ICONS SECTION */}
          <div className="icons" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {/* Login/User Display */}
            {!loggedInUser || !loggedInUser.user ? (
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  color: "black",
                  backgroundColor: "white",
                  border: "2px solid #ffe680",
                  '&:hover': {
                    backgroundColor: "#ffe680",
                    borderColor: "#ffe680"
                  }
                }}
              >
                Login
              </Button>
            ) : null}

            {/* Cart Icon */}
            <Link to="/cart" style={{ color: "black" }} className="cart-icon-link">
              <span className="cart-icon-wrapper">
                <i className="fas fa-shopping-cart" style={{ fontSize: "20px" }}></i>
                {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
              </span>
            </Link>

            {/* Popover Menu Icon */}
            <IconButton onClick={handleUserIconClick}>
              <i className="fa-solid fa-bars" style={{ fontSize: "20px" }}></i>
            </IconButton>
          </div>
        </div>

        {/* Category Carousel */}
        <div className="category-carousel-container">
          <button 
            className="carousel-btn prev-btn"
            onClick={() => document.querySelector('.category-carousel').scrollBy({ left: -200, behavior: 'smooth' })}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="category-carousel">
            {getAllCategories().map(cat => (
              <div 
                key={cat}
                className="category-item"
                onClick={handleCategoryClick}
                data-category={cat}
              >
                <span className="category-icon">{getCategoryIcon(cat)}</span>
                <span className="category-name">{cat}</span>
                <i className="fas fa-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
              </div>
            ))}
          </div>
          
          <button 
            className="carousel-btn next-btn"
            onClick={() => document.querySelector('.category-carousel').scrollBy({ left: 200, behavior: 'smooth' })}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </nav>

      {/* Category Subcategory Popover */}
      <Popover
        open={categoryOpen}
        anchorEl={categoryAnchor}
        onClose={handleCategoryClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          style: {
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginTop: '5px',
            border: '2px solid #ffe680'
          }
        }}
      >
        <Box sx={{ minWidth: '250px' }}>
          <div style={{
            padding: '8px 12px',
            background: '#ffe680',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {selectedCategory && getCategoryIcon(selectedCategory)} {selectedCategory}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '8px'
          }}>
            {selectedCategory && getSubcategories(selectedCategory).map((sub) => (
              <div
                key={sub}
                onClick={() => handleSubcategoryClick(selectedCategory, sub)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  border: '1px solid #dee2e6',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#ffe680'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                › {sub}
              </div>
            ))}
          </div>
        </Box>
      </Popover>

      {/* Popover Menu */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: 200 }}>
          <List>
            <ListItem button onClick={() => handleOptionClick("/admin")}>
              <ListItemText primary="Admin" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick("/userinfo")}>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick("/my-orders")}>
              <ListItemText primary="My Orders" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick("/cart")}>
              <ListItemText primary="Your cart" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick("/watchlist")}>
              <ListItemText primary="WatchList" />
            </ListItem>
            
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem("loggedInUser");
                setLoggedInUser(null);
                setCartCount(0);
                navigate("/login");
                handleClose();
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Popover>
    </>
  );
}

export default Navbar;

