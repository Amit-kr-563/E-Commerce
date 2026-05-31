import axios from 'axios';
import Swal from "sweetalert2";
import { API_BASE_URL } from '../config';

const URL = API_BASE_URL;

// Helper function to get JWT token from localStorage
const getAuthToken = () => {
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));
  return userData?.token;
};

// Helper function to set auth header
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const addUser = (data) => axios.post(`${URL}/register`, data);
export const loginUser = (data) => axios.post(`${URL}/login`, data);
export const getUserInfo = () => 
  axios.get(`${URL}/userinfo`, { headers: getAuthHeaders() });

export const getProductReviews = (productId) => axios.get(`${URL}/api/reviews/product/${productId}`);
export const submitReview = (data) => {
  const token = getAuthToken();
  return axios.post(`${URL}/api/reviews`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
};
export const checkReview = (productId, orderId) => {
  const token = getAuthToken();
  return axios.get(`${URL}/api/reviews/check`, {
    params: { productId, orderId },
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
};

export const getReviewEligibility = () => {
  const token = getAuthToken();
  return axios.get(`${URL}/api/user/review-eligibility`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
};

// Product APIs
export const getAllProducts = () => axios.get(`${URL}/api/products`);
export const getProductById = (id) => axios.get(`${URL}/api/products/${id}`);
export const getProductsByCategory = (category) => axios.get(`${URL}/api/products/category/${category}`);
export const getProductsBySubcategory = (subcategory) => axios.get(`${URL}/api/products/subcategory/${subcategory}`);
export const getProductsByCategoryAndSubcategory = (category, subcategory) => 
  axios.get(`${URL}/api/products/category/${category}/subcategory/${subcategory}`);
export const getRandomProducts = (count = 12) => axios.get(`${URL}/api/products/random/${count}`);

export const useCart = () => {
  const addToCart = async (product) => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    const username = userData?.user?.email || userData?.user?.mobile;

    console.log("=== FRONTEND ADD TO CART DEBUG ===");
    console.log("User data:", userData?.user);
    console.log("Username:", username);
    console.log("Product:", product);

    if (!username) {
      alert("Please login first");
      return;
    }

    try {
      const payload = {
        username,
        product,
      };
      console.log("Sending to server:", payload);
      
      const response = await axios.post(`${URL}/cart`, payload);
      
      console.log("Server response:", response);
                     
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'Item added to cart!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });

      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("=== CART ERROR ===");
      console.error("Error:", error);
      console.error("Error response:", error.response);
      alert("Failed to add to cart. Please try again.");
    }
  };

  return { addToCart };
};
export const useWatchlist = () => {
  const addToWatchlist = async (product) => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    const username = userData?.user?.email || userData?.user?.mobile;

    console.log("=== FRONTEND ADD TO WATCHLIST DEBUG ===");
    console.log("User data:", userData?.user);
    console.log("Username:", username);
    console.log("Product:", product);

    if (!username) {
      alert("Please login first");
      return;
    }

    try {
      const payload = {
        username,
        product,
      };
      console.log("Sending to server:", payload);
      
      const response = await axios.post(`${URL}/watchlist`, payload);
      
      console.log("Server response:", response);
      
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'Added to watchlist!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("=== WATCHLIST ERROR ===");
      console.error("Error:", error);
      console.error("Error response:", error.response);
      alert("Failed to add to watchlist. Please try again.");
    }
  };

  return { addToWatchlist };
};
