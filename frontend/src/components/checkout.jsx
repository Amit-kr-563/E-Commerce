

// // export default ProceedToPayPage;
// import {
//   Avatar,
//   Box,
//   Button,
//   Divider,
//   FormControlLabel,
//   Paper,
//   Radio,
//   RadioGroup,
//   TextField,
//   Typography,
//   useTheme,
//   useMediaQuery
// } from "@mui/material";
// import axios from "axios";
// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// const ProceedToPayPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // Mobile UI standard threshold check
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const { cartItems, totalAmount, user } = location.state || {};

//   const [customAddress, setCustomAddress] = useState("");
//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [addressChoice, setAddressChoice] = useState("registered");
//   const [paymentMethod, setPaymentMethod] = useState("cod");

//   const handleSaveAddress = () => {
//     const trimmed = customAddress.trim();
//     if (trimmed && !savedAddresses.includes(trimmed)) {
//       setSavedAddresses([...savedAddresses, trimmed]);
//       setSelectedAddress(trimmed);
//       setCustomAddress("");
//     }
//   };

//   const getFinalAddress = () => {
//     if (addressChoice === "registered") {
//       return `${user?.addressLine || ""}, ${user?.city || ""}, ${user?.state || ""} - ${user?.pincode || ""}`;
//     } else {
//       return selectedAddress;
//     }
//   };

//   const handlePlaceOrder = async () => {
//     const finalAddress = getFinalAddress();

//     if (!finalAddress || finalAddress.trim() === "," || finalAddress.trim() === " - ") {
//       Swal.fire({
//         toast: true,
//         position: "top",
//         icon: "warning",
//         title: "Please select or enter an address.",
//         showConfirmButton: false,
//         timer: 2000,
//       });
//       return;
//     }

//     // Enhance cart items with productId and sellerId
//     const enhancedCartItems = cartItems.map(item => ({
//       productId: item._id,
//       sellerId: item.sellerId,
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//       img: item.img,
//       status: 'Ordered'
//     }));

//     const orderData = {
//       userId: user?._id,
//       username: user?.email || user?.mobile,
//       fullName: user?.fullName || user?.name,
//       email: user?.email,
//       mobile: user?.mobile,
//       address: finalAddress,
//       paymentMethod,
//       bank: "",
//       cartItems: enhancedCartItems,
//       totalAmount,
//     };

//     if (paymentMethod === "upi") {
//       navigate("/payment", {
//         state: {
//           user,
//           totalAmount,
//           address: finalAddress,
//           cartItems,
//         },
//       });
//     } else {
//       try {
//         await axios.post("http://localhost:8000/order", orderData);
//         Swal.fire({
//           toast: true,
//           position: "top",
//           icon: "success",
//           title: "Order placed successfully!",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//         navigate("/");
//       } catch (err) {
//         console.error("Error placing order:", err);
//         Swal.fire({
//           toast: true,
//           position: "top",
//           icon: "error",
//           title: "Failed to place order!",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//       }
//     }
//   };

//   return (
//     <Box 
//       className="checkout-wrapper" 
//       display="flex" 
//       justifyContent="center" 
//       sx={{
//         background: "linear-gradient(180deg, #fffdf3 0%, #fff8d8 42%, #fff 100%)",
//         minHeight: "100vh",
//         py: { xs: 2, sm: 5 },
//         px: { xs: 1.5, sm: 3 }
//       }}
//     >
//       <Paper 
//         elevation={0} 
//         sx={{ 
//           padding: { xs: 2.5, sm: 4, md: 5 }, 
//           width: "100%", 
//           maxWidth: 850, 
//           borderRadius: 4,
//           border: "1px solid #eef0f2",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//           background: "#ffffff"
//         }}
//       >
//         {/* Page Title */}
//         <Typography 
//           variant={isMobile ? "h5" : "h4"} 
//           gutterBottom 
//           fontWeight={800} 
//           textAlign="center"
//           sx={{ color: "#111", mb: { xs: 3, sm: 4 } }}
//         >
//           Checkout & Payment
//         </Typography>

//         {/* 1. Customer Info Card Section */}
//         <Box 
//           sx={{ 
//             p: 2, 
//             backgroundColor: "#fffef5", 
//             borderRadius: 3, 
//             border: "1px solid #ffe680",
//             mb: 3 
//           }}
//         >
//           <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#b37400", mb: 1, textTransform: "uppercase", fontSize: "0.8rem", tracking: 1.2 }}>
//             Customer Info
//           </Typography>
//           <Box display="flex" flexDirection="column" gap={0.5}>
//             <Typography sx={{ fontSize: "0.95rem" }}><Box component="span" fontWeight={600}>Name:</Box> {user?.fullName || user?.name || "N/A"}</Typography>
//             <Typography sx={{ fontSize: "0.95rem" }}><Box component="span" fontWeight={600}>Email:</Box> {user?.email || "N/A"}</Typography>
//             <Typography sx={{ fontSize: "0.95rem" }}><Box component="span" fontWeight={600}>Mobile:</Box> {user?.mobile || "N/A"}</Typography>
//           </Box>
//         </Box>

//         {/* 2. Delivery Address Selection Layer */}
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, color: "#222" }}>
//             Delivery Address
//           </Typography>
          
//           <Box display="flex" flexDirection="column" gap={1.5}>
//             {/* Registered Address Selection Option */}
//             <Box 
//               onClick={() => setAddressChoice("registered")}
//               sx={{
//                 p: 2,
//                 borderRadius: 2.5,
//                 border: "2px solid",
//                 borderColor: addressChoice === "registered" ? "#2ecc71" : "#f1f1f1",
//                 backgroundColor: addressChoice === "registered" ? "#f4fdf7" : "#fff",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease"
//               }}
//             >
//               <FormControlLabel
//                 sx={{ m: 0, width: "100%", alignItems: "flex-start" }}
//                 control={<Radio checked={addressChoice === "registered"} onChange={() => setAddressChoice("registered")} color="success" sx={{ pt: 0.2 }} />}
//                 label={
//                   <Box sx={{ ml: 1 }}>
//                     <Typography fontWeight={700} fontSize="0.95rem" color={addressChoice === "registered" ? "#1e7e34" : "#333"}>Default Registered Address</Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.4 }}>
//                       {user?.addressLine || user?.city || user?.state || user?.pincode 
//                         ? `${user?.addressLine || ""}, ${user?.city || ""}, ${user?.state || ""} - ${user?.pincode || ""}`
//                         : "No address registered in profile."}
//                     </Typography>
//                   </Box>
//                 }
//               />
//             </Box>

//             {/* Custom Address Input Option */}
//             <Box 
//               onClick={() => setAddressChoice("custom")}
//               sx={{
//                 p: 2,
//                 borderRadius: 2.5,
//                 border: "2px solid",
//                 borderColor: addressChoice === "custom" ? "#2ecc71" : "#f1f1f1",
//                 backgroundColor: addressChoice === "custom" ? "#f4fdf7" : "#fff",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease"
//               }}
//             >
//               <FormControlLabel
//                 sx={{ m: 0, width: "100%", alignItems: "flex-start" }}
//                 control={<Radio checked={addressChoice === "custom"} onChange={() => setAddressChoice("custom")} color="success" sx={{ pt: 0.2 }} />}
//                 label={
//                   <Box sx={{ ml: 1, width: "100%" }}>
//                     <Typography fontWeight={700} fontSize="0.95rem" color={addressChoice === "custom" ? "#1e7e34" : "#333"}>Use Custom / New Address</Typography>
//                   </Box>
//                 }
//               />

//               {addressChoice === "custom" && (
//                 <Box sx={{ mt: 2, ml: { xs: 0, sm: 4 } }} onClick={(e) => e.stopPropagation()}>
//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={3}
//                     value={customAddress}
//                     onChange={(e) => setCustomAddress(e.target.value)}
//                     placeholder="Type your complete delivery address with landmark and pincode..."
//                     variant="outlined"
//                     sx={{ backgroundColor: "#fff", borderRadius: 1.5 }}
//                   />
//                   <Button 
//                     variant="contained" 
//                     onClick={handleSaveAddress} 
//                     disabled={!customAddress.trim()}
//                     sx={{ 
//                       mt: 1.5, 
//                       textTransform: "none", 
//                       fontWeight: 600, 
//                       backgroundColor: "#111",
//                       '&:hover': { backgroundColor: "#333" }
//                     }}
//                   >
//                     Save Address
//                   </Button>

//                   {savedAddresses.length > 0 && (
//                     <Box mt={3} p={1.5} bgcolor="#ffffff" borderRadius={2} border="1px dashed #ccc">
//                       <Typography variant="body2" fontWeight={700} color="text.secondary" mb={1}>Select from recently saved:</Typography>
//                       {savedAddresses.map((addr, i) => (
//                         <Box 
//                           key={i} 
//                           display="flex" 
//                           alignItems="center" 
//                           sx={{ 
//                             p: 1, 
//                             borderBottom: i !== savedAddresses.length - 1 ? "1px solid #f5f5f5" : "none",
//                             cursor: "pointer"
//                           }}
//                           onClick={() => setSelectedAddress(addr)}
//                         >
//                           <Radio 
//                             checked={selectedAddress === addr} 
//                             onChange={() => setSelectedAddress(addr)} 
//                             color="success" 
//                             size="small"
//                           />
//                           <Typography variant="body2" sx={{ ml: 1, color: "#444" }}>{addr}</Typography>
//                         </Box>
//                       ))}
//                     </Box>
//                   )}
//                 </Box>
//               )}
//             </Box>
//           </Box>

//           {/* Micro confirmation label bar */}
//           <Box mt={2} p={1.5} bgcolor="#f9f9f9" borderRadius={2} borderLeft="4px solid #ffe680">
//             <Typography variant="body2" sx={{ fontStyle: "italic", color: "#555", wordBreak: "break-word" }}>
//               <Box component="span" fontWeight={700} fontStyle="normal">Shipping To: </Box> 
//               {getFinalAddress() && getFinalAddress().replace(/^[,\s-]+|[,\s-]+$/g, '') ? getFinalAddress() : "None selected yet"}
//             </Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 3 }} />

//         {/* 3. Basket Cart Items Preview Container */}
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "#222" }}>
//             Items in Your Order
//           </Typography>
          
//           <Box display="flex" flexDirection="column" gap={1.5} sx={{ maxH: 300, overflowY: "auto", pr: 0.5 }}>
//             {cartItems?.map((item) => (
//               <Box 
//                 key={item._id} 
//                 display="flex" 
//                 alignItems="center" 
//                 gap={2}
//                 sx={{ 
//                   p: 1.5, 
//                   border: "1px solid #f0f0f0", 
//                   borderRadius: 2.5,
//                   backgroundColor: "#fafafa" 
//                 }}
//               >
//                 <Avatar src={item.img} variant="square" sx={{ width: 60, height: 60, borderRadius: 1.5, objectFit: "cover" }} />
//                 <Box flex={1}>
//                   <Typography fontWeight={700} sx={{ fontSize: "0.95rem", color: "#111", lineHeight: 1.2 }}>
//                     {item.name}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                     ₹{Number(item.price).toFixed(2)} × {item.quantity}
//                   </Typography>
//                 </Box>
//                 <Typography fontWeight={700} sx={{ color: "#111", fontSize: "0.95rem", minWidth: "fit-content" }}>
//                   ₹{(item.price * item.quantity).toFixed(2)}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         {/* Total Pricing Label Card */}
//         <Box 
//           display="flex" 
//           justifyContent="space-between" 
//           alignItems="center" 
//           sx={{ 
//             p: 2, 
//             bgcolor: "#fff8d9", 
//             borderRadius: 2.5,
//             border: "1px solid #ffe680",
//             mb: 4
//           }}
//         >
//           <Typography variant="subtitle1" fontWeight={700} color="#444">Total Payable Amount</Typography>
//           <Typography variant="h5" fontWeight={800} color="#111">
//             ₹{Number(totalAmount || 0).toFixed(2)}
//           </Typography>
//         </Box>

//         <Divider sx={{ my: 3 }} />

//         {/* 4. Payment Gateway Option Cards */}
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "#222" }}>
//             Select Payment Method
//           </Typography>
          
//           <RadioGroup row={!isMobile} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
//             <Box 
//               display="flex" 
//               flexDirection="column" 
//               gap={1.5} 
//               width="100%" 
//               sx={{ flexDirection: { xs: "column", sm: "row" } }}
//             >
//               {/* COD Method Block */}
//               <Box 
//                 onClick={() => setPaymentMethod("cod")}
//                 sx={{
//                   flex: 1,
//                   p: 2,
//                   borderRadius: 2.5,
//                   border: "2px solid",
//                   borderColor: paymentMethod === "cod" ? "#2ecc71" : "#f1f1f1",
//                   backgroundColor: paymentMethod === "cod" ? "#f4fdf7" : "#fff",
//                   cursor: "pointer",
//                   transition: "all 0.2s ease"
//                 }}
//               >
//                 <FormControlLabel value="cod" control={<Radio color="success" />} label={<Box component="span" fontWeight={600} fontSize="0.95rem">Cash on Delivery (COD)</Box>} />
//               </Box>

//               {/* UPI Method Block */}
//               <Box 
//                 onClick={() => setPaymentMethod("upi")}
//                 sx={{
//                   flex: 1,
//                   p: 2,
//                   borderRadius: 2.5,
//                   border: "2px solid",
//                   borderColor: paymentMethod === "upi" ? "#2ecc71" : "#f1f1f1",
//                   backgroundColor: paymentMethod === "upi" ? "#f4fdf7" : "#fff",
//                   cursor: "pointer",
//                   transition: "all 0.2s ease"
//                 }}
//               >
//                 <FormControlLabel value="upi" control={<Radio color="success" />} label={<Box component="span" fontWeight={600} fontSize="0.95rem">Online UPI Transfer</Box>} />
//               </Box>
//             </Box>
//           </RadioGroup>

//           {paymentMethod === "upi" && (
//             <Typography variant="caption" display="block" sx={{ mt: 1.5, color: "#777", pl: 0.5, fontStyle: "italic" }}>
//               * You will be securely redirected to the UPI integration portal to scan the code or enter your VPA.
//             </Typography>
//           )}
//         </Box>

//         {/* Final Execution Button Area */}
//         <Box display="flex" width="100%" mt={2}>
//           <Button
//             variant="contained"
//             color="success"
//             size="large"
//             onClick={handlePlaceOrder}
//             disabled={
//               (addressChoice === "custom" && !selectedAddress) ||
//               (addressChoice === "registered" &&
//                 (!user?.addressLine || !user?.city || !user?.state || !user?.pincode))
//             }
//             sx={{ 
//               fontWeight: 800, 
//               textTransform: "none",
//               py: { xs: 1.8, sm: 1.5 },
//               px: 5,
//               borderRadius: 2.5,
//               fontSize: "1.05rem",
//               width: { xs: "100%", sm: "auto" }, // Mobile par absolute full width checkout button banega
//               marginLeft: { sm: "auto" },
//               backgroundColor: "#2ecc71",
//               boxShadow: "0 4px 12px rgba(46, 204, 113, 0.2)",
//               '&:hover': {
//                 backgroundColor: "#27b764",
//                 boxShadow: "0 6px 16px rgba(46, 204, 113, 0.35)"
//               }
//             }}
//           >
//             {paymentMethod === "cod" ? "Confirm & Place Order" : "Secure Pay Now"}
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default ProceedToPayPage;


import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

/**
 * Razorpay Script Loader Helper
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ProceedToPayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { cartItems, totalAmount, user } = location.state || {};

  const [customAddress, setCustomAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressChoice, setAddressChoice] = useState("registered");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const handleSaveAddress = () => {
    const trimmed = customAddress.trim();
    if (trimmed && !savedAddresses.includes(trimmed)) {
      setSavedAddresses([...savedAddresses, trimmed]);
      setSelectedAddress(trimmed);
      setCustomAddress("");
    }
  };

  const getFinalAddress = () => {
    if (addressChoice === "registered") {
      return `${user?.addressLine || ""}, ${user?.city || ""}, ${user?.state || ""} - ${user?.pincode || ""}`;
    } else {
      return selectedAddress;
    }
  };

  // Common order payload builder
  const buildOrderPayload = (finalAddress, transactionId = "") => {
    const enhancedCartItems = cartItems.map(item => ({
      productId: item._id,
      sellerId: item.sellerId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      img: item.img,
      status: 'Ordered'
    }));

    return {
      userId: user?._id,
      username: user?.email || user?.mobile,
      fullName: user?.fullName || user?.name,
      email: user?.email,
      mobile: user?.mobile,
      address: finalAddress,
      paymentMethod: transactionId ? "UPI (Razorpay)" : "COD",
      bank: transactionId ? "Online Gateway" : "",
      paymentId: transactionId,
      cartItems: enhancedCartItems,
      totalAmount,
    };
  };

  const handlePlaceOrder = async () => {
    const finalAddress = getFinalAddress();

    if (!finalAddress || finalAddress.trim() === "," || finalAddress.trim() === " - ") {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "Please select or enter an address.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    // --- CASE 1: ONLINE PAYMENT (RAZORPAY) ---
    if (paymentMethod === "upi") {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        Swal.fire("Error", "Razorpay SDK failed to load. Check internet connection.", "error");
        return;
      }

      try {
        setLoading(true);
        console.log("Initiating payment request for amount:", totalAmount);

       
      
// const orderRes = await axios.create().post("http://localhost:8000/api/payment/create-order", {
//   amount: totalAmount
// });

const orderRes = await axios.create().post("https://e-commerce-pkcj.onrender.com/api/payment/create-order", {
  amount: totalAmount
});

        console.log("Backend Response Raw Data:", orderRes.data);

        // Safe extraction handling case response structure securely
        const orderId = orderRes.data?.orderId;
        const amount = orderRes.data?.amount;
        const key = orderRes.data?.key;

        if (!orderId || !key) {
          throw new Error("Missing orderId or Razorpay Key from backend signature.");
        }

        const options = {
          key: key,
          amount: amount,
          currency: "INR",
          name: "Sudocart",
          description: "Order Checkout Payment",
          order_id: orderId,
          prefill: {
            name: user?.fullName || user?.name || "",
            email: user?.email || "",
            contact: user?.mobile || "",
          },
          theme: {
            color: "#2ecc71",
          },
          handler: async function (response) {
            try {
              console.log("Razorpay Success Token Received. Verification triggering...", response);
              
              // Signature Verification
//               const verifyRes = await axios.create().post("http://localhost:8000/api/payment/verify", {
//   razorpay_payment_id: response.razorpay_payment_id,
//   razorpay_order_id: response.razorpay_order_id,
//   razorpay_signature: response.razorpay_signature,
// });

const verifyRes = await axios.create().post("https://e-commerce-pkcj.onrender.com/api/payment/verify", {
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_order_id: response.razorpay_order_id,
  razorpay_signature: response.razorpay_signature,
});
              if (verifyRes.data && verifyRes.data.success) {
                console.log("Payment Verified! Logging order payload inside MongoDB.");
                
                const finalPayload = buildOrderPayload(finalAddress, response.razorpay_payment_id);
                await axios.post("http://localhost:8000/order", finalPayload);
                
                Swal.fire("Success", "Payment Successful & Order Placed!", "success");
                navigate("/");
              } else {
                Swal.fire("Error", "Payment verification failed securely.", "error");
              }
            } catch (vErr) {
              console.error("Verification system API breakdown:", vErr);
              Swal.fire("Error", "Order logging failed after payment verification.", "error");
            }
          },
          modal: {
            ondismiss: function () {
              Swal.fire("Cancelled", "Payment process terminated by user.", "info");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("CRITICAL RAZORPAY FRONTEND ERROR LOG:", err);
        
        // Exact response log mapping for user troubleshooting
        const errorServerMsg = err.response?.data?.message || err.message || "";
        Swal.fire("Error", `Failed to initialize standard online gateway. ${errorServerMsg}`, "error");
      } finally {
        setLoading(false);
      }

    // --- CASE 2: CASH ON DELIVERY ---
    } else {
      try {
        setLoading(true);
        const finalPayload = buildOrderPayload(finalAddress);
        await axios.post("http://localhost:8000/order", finalPayload);
        
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Order placed successfully via COD!",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/");
      } catch (err) {
        console.error("Error placing COD order:", err);
        Swal.fire("Error", "Failed to record Cash on Delivery request.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box 
      className="checkout-wrapper" 
      display="flex" 
      justifyContent="center" 
      sx={{
        background: "linear-gradient(180deg, #fffdf3 0%, #fff8d8 42%, #fff 100%)",
        minHeight: "100vh",
        py: { xs: 2, sm: 5 },
        px: { xs: 1.5, sm: 3 }
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          padding: { xs: 2.5, sm: 4, md: 5 }, 
          width: "100%", 
          maxWidth: 850, 
          borderRadius: 4,
          border: "1px solid #eef0f2",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          background: "#ffffff"
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom 
          fontWeight={800} 
          textAlign="center"
          sx={{ color: "#111", mb: { xs: 3, sm: 4 } }}
        >
          Checkout & Payment
        </Typography>

        {/* Customer Info Card Section */}
        <Box sx={{ p: 2, backgroundColor: "#fffef5", borderRadius: 3, border: "1px solid #ffe680", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#b37400", mb: 1, textTransform: "uppercase", fontSize: "0.8rem" }}>
            Customer Info
          </Typography>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Typography sx={{ fontSize: "0.95rem" }}><Box component="span" fontWeight={600}>Name:</Box> {user?.fullName || user?.name || "N/A"}</Typography>
            <Typography sx={{ fontSize: "0.95rem" }}><Box component="span" fontWeight={600}>Email:</Box> {user?.email || "N/A"}</Typography>
            <Typography sx={{ fontSize: "0.95rem" }}><Box component="span" fontWeight={600}>Mobile:</Box> {user?.mobile || "N/A"}</Typography>
          </Box>
        </Box>

        {/* Delivery Address Selection Layer */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, color: "#222" }}>
            Delivery Address
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={1.5}>
            <Box 
              onClick={() => setAddressChoice("registered")}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: "2px solid",
                borderColor: addressChoice === "registered" ? "#2ecc71" : "#f1f1f1",
                backgroundColor: addressChoice === "registered" ? "#f4fdf7" : "#fff",
                cursor: "pointer"
              }}
            >
              <FormControlLabel
                sx={{ m: 0, width: "100%", alignItems: "flex-start" }}
                control={<Radio checked={addressChoice === "registered"} onChange={() => setAddressChoice("registered")} color="success" />}
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography fontWeight={700} fontSize="0.95rem" color={addressChoice === "registered" ? "#1e7e34" : "#333"}>Default Registered Address</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.4 }}>
                      {user?.addressLine || user?.city || user?.state || user?.pincode 
                        ? `${user?.addressLine || ""}, ${user?.city || ""}, ${user?.state || ""} - ${user?.pincode || ""}`
                        : "No address registered in profile."}
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box 
              onClick={() => setAddressChoice("custom")}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: "2px solid",
                borderColor: addressChoice === "custom" ? "#2ecc71" : "#f1f1f1",
                backgroundColor: addressChoice === "custom" ? "#f4fdf7" : "#fff",
                cursor: "pointer"
              }}
            >
              <FormControlLabel
                sx={{ m: 0, width: "100%", alignItems: "flex-start" }}
                control={<Radio checked={addressChoice === "custom"} onChange={() => setAddressChoice("custom")} color="success" />}
                label={<Box sx={{ ml: 1 }}><Typography fontWeight={700} fontSize="0.95rem" color={addressChoice === "custom" ? "#1e7e34" : "#333"}>Use Custom / New Address</Typography></Box>}
              />

              {addressChoice === "custom" && (
                <Box sx={{ mt: 2, ml: { xs: 0, sm: 4 } }} onClick={(e) => e.stopPropagation()}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Type your complete delivery address..."
                    variant="outlined"
                  />
                  <Button variant="contained" onClick={handleSaveAddress} disabled={!customAddress.trim()} sx={{ mt: 1.5, backgroundColor: "#111" }}>
                    Save Address
                  </Button>

                  {savedAddresses.length > 0 && (
                    <Box mt={3} p={1.5} bgcolor="#ffffff" borderRadius={2} border="1px dashed #ccc">
                      {savedAddresses.map((addr, i) => (
                        <Box key={i} display="flex" alignItems="center" sx={{ cursor: "pointer" }} onClick={() => setSelectedAddress(addr)}>
                          <Radio checked={selectedAddress === addr} onChange={() => setSelectedAddress(addr)} color="success" size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>{addr}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          <Box mt={2} p={1.5} bgcolor="#f9f9f9" borderRadius={2} borderLeft="4px solid #ffe680">
            <Typography variant="body2" sx={{ fontStyle: "italic", color: "#555", wordBreak: "break-word" }}>
              <Box component="span" fontWeight={700} fontStyle="normal">Shipping To: </Box> 
              {getFinalAddress() && getFinalAddress().replace(/^[,\s-]+|[,\s-]+$/g, '') ? getFinalAddress() : "None selected yet"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Items Preview */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "#222" }}>
            Items in Your Order
          </Typography>
          <Box display="flex" flexDirection="column" gap={1.5} sx={{ maxH: 220, overflowY: "auto" }}>
            {cartItems?.map((item) => (
              <Box key={item._id} display="flex" alignItems="center" gap={2} sx={{ p: 1.5, border: "1px solid #f0f0f0", borderRadius: 2.5, backgroundColor: "#fafafa" }}>
                <Avatar src={item.img} variant="square" sx={{ width: 50, height: 50, borderRadius: 1.5 }} />
                <Box flex={1}>
                  <Typography fontWeight={700} sx={{ fontSize: "0.95rem" }}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">₹{Number(item.price).toFixed(2)} × {item.quantity}</Typography>
                </Box>
                <Typography fontWeight={700}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Pricing Summary */}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2, bgcolor: "#fff8d9", borderRadius: 2.5, border: "1px solid #ffe680", mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={700} color="#444">Total Payable Amount</Typography>
          <Typography variant="h5" fontWeight={800} color="#111">₹{Number(totalAmount || 0).toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Payment Gateways Option Cards */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "#222" }}>
            Select Payment Method
          </Typography>
          <RadioGroup row={!isMobile} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <Box display="flex" flexDirection="column" gap={1.5} width="100%" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
              <Box 
                onClick={() => setPaymentMethod("cod")}
                sx={{ flex: 1, p: 2, borderRadius: 2.5, border: "2px solid", borderColor: paymentMethod === "cod" ? "#2ecc71" : "#f1f1f1", backgroundColor: paymentMethod === "cod" ? "#f4fdf7" : "#fff", cursor: "pointer" }}
              >
                <FormControlLabel value="cod" control={<Radio color="success" />} label={<Box component="span" fontWeight={600}>Cash on Delivery (COD)</Box>} />
              </Box>

              <Box 
                onClick={() => setPaymentMethod("upi")}
                sx={{ flex: 1, p: 2, borderRadius: 2.5, border: "2px solid", borderColor: paymentMethod === "upi" ? "#2ecc71" : "#f1f1f1", backgroundColor: paymentMethod === "upi" ? "#f4fdf7" : "#fff", cursor: "pointer" }}
              >
                <FormControlLabel value="upi" control={<Radio color="success" />} label={<Box component="span" fontWeight={600}>Online Pay (UPI/Cards/Netbanking)</Box>} />
              </Box>
            </Box>
          </RadioGroup>
        </Box>

        {/* Submission CTA */}
        <Box display="flex" width="100%" mt={2}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handlePlaceOrder}
            disabled={
              loading ||
              (addressChoice === "custom" && !selectedAddress) ||
              (addressChoice === "registered" &&
                (!user?.addressLine || !user?.city || !user?.state || !user?.pincode))
            }
            sx={{ 
              fontWeight: 800, textTransform: "none", py: 1.5, px: 5, borderRadius: 2.5, fontSize: "1.05rem",
              width: { xs: "100%", sm: "auto" }, marginLeft: { sm: "auto" }, backgroundColor: "#2ecc71",
              boxShadow: "0 4px 12px rgba(46, 204, 113, 0.2)",
              '&:hover': { backgroundColor: "#27b764" }
            }}
          >
            {loading ? "Processing..." : paymentMethod === "cod" ? "Confirm & Place Order" : "Pay with Razorpay"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProceedToPayPage;