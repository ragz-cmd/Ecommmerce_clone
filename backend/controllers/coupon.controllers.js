import Coupon from "../models/coupons.model";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.status(200).json(coupon || null);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code, isActive: true });
    if (!coupon) {
      return res
        .status(404)
        .json({ error: "Invalid coupon", message: "coupon not found" });
    }
    if (coupon.expirationDate < Date.now()) {
      coupon.isActive = false;
      await coupon.save();
      return res
        .status(400)
        .json({ error: "Invalid coupon", message: "coupon expired" });
    }
    res.status(200).json({
      message: "coupon is valid",
      code: code,
      discount: coupon.discount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
