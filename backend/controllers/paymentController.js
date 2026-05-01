// Payment Controller
// Razorpay payment gateway integration

const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Razorpay SDK - graceful init
let Razorpay;
let razorpayInstance;
try {
  Razorpay = require('razorpay');
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}
} catch (e) {
  console.log('Razorpay not configured - payment features disabled');
}

// POST /api/payment/create-order
const createOrder = async (req, res, next) => {
  try {
    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway not configured. Please add Razorpay credentials in .env file.'
      });
    }

    const amount = 49900; 
    const receipt = `rcpt_${req.user._id}_${Date.now()}`;

    const order = await razorpayInstance.orders.create({
      amount,
      currency: 'INR',
      receipt,
      notes: { userId: req.user._id.toString(), planType: 'premium' }
    });

    // Save order to DB
    await Payment.create({
      userId: req.user._id,
      razorpayOrderId: order.id,
      amount,
      currency: 'INR',
      receipt,
      status: 'created'
    });

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/payment/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment details incomplete.' });
    }

    // HMAC-SHA256 signature verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid'
      }
    );

    // Upgrade user to premium
    await User.findByIdAndUpdate(req.user._id, {
      isPremium: true,
      planType: 'premium',
      aiLimit: 9999,
      premiumActivatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Payment successful! Premium access unlock ho gaya 🌟'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/payment/history
const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, getPaymentHistory };


