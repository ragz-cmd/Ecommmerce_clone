import Order from "../models/orders.model.js";

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order using the Razorpay order ID, selecting only `_id` and `totalPrice`
    const order = await Order.findOne(
      { razorpayOrderId: orderId },
      "_id totalPrice"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      id: order._id, // Send `_id` as `id`
      totalPrice: order.totalPrice,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
