


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
// } from "@mui/material";
// import axios from "axios";
// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// /**
//  * Load Razorpay Script
//  */
// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// const UPIPaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { user, totalAmount, address, cartItems } = location.state || {};

//   const [upiMethod, setUpiMethod] = useState("PhonePe");
//   const [upiId, setUpiId] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleFinalPayment = async () => {
//     if (!upiId.trim()) {
//       Swal.fire({
//         toast: true,
//         position: "top",
//         icon: "warning",
//         title: "Please enter your UPI ID",
//         showConfirmButton: false,
//         timer: 2000,
//       });
//       return;
//     }

//     const razorpayLoaded = await loadRazorpayScript();
//     if (!razorpayLoaded) {
//       Swal.fire("Error", "Razorpay SDK failed to load", "error");
//       return;
//     }

//     try {
//       setLoading(true);

      
//       const orderRes = await axios.post(
//         "http://localhost:8000/api/payment/create-order",
//         { amount: totalAmount }
//       );

//       const { orderId, amount, key } = orderRes.data;

     
//       const options = {
//         key,
//         amount,
//         currency: "INR",
//         name: "Sudocart",
//         description: "Order Payment",
//         order_id: orderId,
//         method: {
//           upi: true,
//         },
//         prefill: {
//           name: user?.name,
//           email: user?.email,
//           contact: user?.mobile,
//         },
//         theme: {
//           color: "#2ecc71",
//         },
//         handler: async function (response) {
//           /**
//             Verify Payment
//            */
//           const verifyRes = await axios.post(
//             "http://localhost:8000/api/payment/verify",
//             {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//             }
//           );

//           if (verifyRes.data.success) {
//             /**
//              * 4️⃣ Save Order in DB (Your existing API)
//              */
//             const enhancedCartItems = cartItems.map((item) => ({
//               productId: item._id,
//               sellerId: item.sellerId,
//               name: item.name,
//               price: item.price,
//               quantity: item.quantity,
//               img: item.img,
//               status: "Ordered",
//             }));

//             await axios.post("http://localhost:8000/order", {
//               userId: user?._id,
//               username: user?.email || user?.mobile,
//               fullName: user?.name,
//               email: user?.email,
//               mobile: user?.mobile,
//               address,
//               paymentMethod: "UPI (Razorpay)",
//               bank: upiMethod,
//               upiId,
//               cartItems: enhancedCartItems,
//               totalAmount,
//               paymentId: response.razorpay_payment_id,
//             });

//             Swal.fire("Success", "Payment Successful & Order Placed!", "success");
//             navigate("/");
//           } else {
//             Swal.fire("Error", "Payment verification failed", "error");
//           }
//         },
//         modal: {
//           ondismiss: function () {
//             Swal.fire("Cancelled", "Payment cancelled", "info");
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Payment Failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center" mt={5}>
//       <Paper elevation={4} sx={{ p: 5, width: "100%", maxWidth: 700, borderRadius: 3 }}>
//         <Typography variant="h4" textAlign="center" fontWeight={600} gutterBottom>
//           UPI Payment
//         </Typography>

//         <Typography>Name: {user?.name}</Typography>
//         <Typography>Email: {user?.email}</Typography>
//         <Typography>Mobile: {user?.mobile}</Typography>
//         <Typography sx={{ mt: 1 }}>Deliver To: {address}</Typography>

//         <Divider sx={{ my: 3 }} />

//         <Typography variant="subtitle1" fontWeight={500}>
//           Select UPI Method:
//         </Typography>
//         <RadioGroup
//           row
//           value={upiMethod}
//           onChange={(e) => setUpiMethod(e.target.value)}
//         >
//           <FormControlLabel value="PhonePe" control={<Radio />} label="PhonePe" />
//           <FormControlLabel value="Google Pay" control={<Radio />} label="Google Pay" />
//           <FormControlLabel value="Paytm" control={<Radio />} label="Paytm" />
//           <FormControlLabel value="BHIM" control={<Radio />} label="BHIM" />
//         </RadioGroup>

//         <TextField
//           label="Enter your UPI ID"
//           fullWidth
//           value={upiId}
//           onChange={(e) => setUpiId(e.target.value)}
//           placeholder="example@upi"
//           sx={{ my: 3 }}
//         />

//         <Typography variant="subtitle1" fontWeight={500}>
//           Items:
//         </Typography>

//         {cartItems?.map((item) => (
//           <Box key={item._id} display="flex" alignItems="center" gap={2} mt={2}>
//             <Avatar src={item.img} variant="square" sx={{ width: 60, height: 60 }} />
//             <Box>
//               <Typography>{item.name}</Typography>
//               <Typography variant="body2">
//                 ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
//               </Typography>
//             </Box>
//           </Box>
//         ))}

//         <Typography variant="h6" align="right" mt={4}>
//           Amount to Pay: ₹{totalAmount}
//         </Typography>

//         <Box mt={4} display="flex" justifyContent="center">
//           <Button
//             variant="contained"
//             size="large"
//             disabled={loading}
//             onClick={handleFinalPayment}
//             sx={{ backgroundColor: "#2ecc71" }}
//           >
//             {loading ? "Processing..." : "Pay with UPI"}
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default UPIPaymentPage;
