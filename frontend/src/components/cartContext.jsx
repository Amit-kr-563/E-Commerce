
import axios from "axios";
import Swal from "sweetalert2";
// Custom hook to use cart functions
export const useCart = () => {
  const addToCart = async (product) => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    const username = userData?.user?.username || userData?.user?.email || userData?.user?.mobile;

    if (!username) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post("http://localhost:8000/cart", {
        username,
        product,
      });

     
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
      console.error("Error adding to cart:", error);
    }
  };

  return { addToCart };
};


