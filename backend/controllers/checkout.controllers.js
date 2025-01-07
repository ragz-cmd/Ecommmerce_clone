import Coupon from "../models/coupons.model.js";
import razorpay from "../lib/razorpay.js";
import Order from "../models/orders.model.js";
import dotenv from "dotenv";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

dotenv.config();

export const checkoutService = async (req, res) => {
  try {
    const { products, couponCode } = req.body; //products = [{productId,quantity,price}]

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty array of products" });
    }

    // Step 1: Calculate total amount
    const totalAmount = products.reduce((sum, product) => {
      if (!product.price || !product.quantity) {
        throw new Error("Invalid product details");
      }
      return sum + product.price * product.quantity * 100;
    }, 0);

    // Step 2: Apply coupon discount if applicable
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
        userId: req.user._id,
      });
      if (coupon) {
        totalAmount -= Math.round(totalAmount * (coupon.discount / 100));
      }
    }

    // Step 3: Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount, // Total amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        couponCode: couponCode || null,
        products: JSON.stringify(products), // Save product details as metadata
      },
    });

    // Step 4: Optionally create a new coupon if threshold is met
    if (totalAmount > 300000) {
      await createNewCoupon(req.user._id.toString());
    }

    // Step 5: Respond with order details
    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      razorpayKey: process.env.RAZORPAY_ID,
      totalAmount: totalAmount, // Convert back to INR for client display
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper to create a new coupon

export const checkoutSuccess = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      process.env.RAZORPAY_SECRET
    );

    //const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment details" });
    }

    // Step 2: Retrieve order details using paymentId
    // This is fetched from the payment details
    const orderDetails = await razorpay.orders.fetch(razorpay_order_id);

    // Step 3: Deactivate coupon if applied
    if (orderDetails.notes && orderDetails.notes.couponCode) {
      const couponCode = orderDetails.notes.couponCode;
      const userId = orderDetails.notes.userId;

      await Coupon.findOneAndUpdate(
        { code: couponCode, userId: userId },
        { isActive: false }
      );
    }

    // Step 4: Create a new order record in your system
    const products = JSON.parse(orderDetails.notes.products); // Assuming you saved products in `notes`
    const newOrder = new Order({
      user: orderDetails.notes.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: parseInt(product.quantity),
        price: parseFloat(product.price),
      })),
      totalAmount: orderDetails.amount / 100, // Convert from paise to INR
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    await newOrder.save();

    res.redirect(
      `${process.env.CLIENT_URL}/payment-status?orderId=${newOrder.razorpayOrderId}`
    );
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res.redirect(`${process.env.CLIENT_URL}/payment-status?orderId=failed`);
  }
};

const createNewCoupon = async (userId) => {
  const coupon = new Coupon({
    userId: userId,
    discount: 10, // 10% discount
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1-day validity
    code: "SIGMA" + Math.floor(Math.random() * 1000000 + 6969).toString(),
  });
  await coupon.save();
};
