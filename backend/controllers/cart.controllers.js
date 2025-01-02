import Product from "../models/products.model.js";

export const getAllCartItems = async (req, res) => {
  try {
    const User = req.user;
    const products = await Product.find({ _id: { $in: User.cartItems } });
    const cartItems = products.map((product) => {
      const item = User.cartItems.find((item) => item.id === product._id);
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.status(200).json(cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const addCartItem = async (req, res) => {
  try {
    const User = req.user;
    const { productId } = req.body;
    const existingCartItem = await User.cartItems.find(
      (item) => item.id === productId
    );
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      await User.cartItems.push(productId);
    }
    await User.save();
    res.status(201).json(User.cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const removeAllCartItem = async (req, res) => {
  try {
    const User = req.user;
    const { productId } = req.body;
    if (!productId) {
      User.cartItems = [];
    } else {
      User.cartItems = User.cartItems.filter((item) => item.id !== productId);
    }
    await User.save();
    res.status(201).json(User.cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const User = req.user;
    const { id: productId } = req.params;
    const { quantity } = req.body;
    if (quantity === 0) {
      User.cartItems = User.cartItems.filter((item) => item.id !== productId);
    } else {
      const existingCartItem = await User.cartItems.find(
        (item) => item.id === productId
      );
      if (!existingCartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      existingCartItem.quantity = quantity;
    }

    await User.save();
    res.status(201).json(User.cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
