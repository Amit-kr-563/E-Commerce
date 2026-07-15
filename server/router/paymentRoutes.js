const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
      const amountInput = req.body.amount;
const amount = Math.round(parseFloat(amountInput));

if (isNaN(amount) || amount <= 0) {
  return res.status(400).json({ success: false, message: "Valid Amount required" });
}
    
    console.log("=== RAZORPAY KEY CHECK ===", process.env.RAZORPAY_KEY_ID); 

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }


    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay keys are not configured in environment variables');
      return res.status(500).json({ success: false, message: 'Payment gateway not configured' });
    }

    
  

const options = {
  amount: amount * 100, 
  currency: "INR",
  receipt: `receipt_${Date.now()}`,
};

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});


router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay secret not configured');
      return res.status(500).json({ success: false, message: 'Payment gateway not configured' });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid signature",
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
