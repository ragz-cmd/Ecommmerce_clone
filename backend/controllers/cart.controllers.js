import Product from "../models/products.model.js";

export const getAllCartItems = async (req, res) => {
  try {
    const User = req.user;

    if (!User.cartItems || !Array.isArray(User.cartItems)) {
      return res.status(400).json({ message: "Cart is empty or invalid" });
    }

    const products = await Product.find({
      _id: { $in: User.cartItems.map((item) => item.id) },
    });

    const cartItems = products.map((product) => {
      const item = User.cartItems.find(
        (item) => item.id.toString() === product._id.toString()
      );
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category,
        quantity: item?.quantity || 0, // Default quantity to 0 if item is not found
      };
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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

export const removeCartItem = async (req, res) => {
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
