import Product from "../models/products.model.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    const mappedProducts = products.map((product) => ({
      id: String(product._id), // Convert ObjectId to string
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    }));

    res.status(200).json(mappedProducts); // Return the mapped products
  } catch (error) {
    console.error("Error fetching products:", error.message); // Log error
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message, // Include the error message for debugging
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;
    let c_response;
    if (image) {
      c_response = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: c_response?.secure_url ? c_response?.secure_url : "",
    });
    res.status(201).json({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.image) {
      const imageId = product.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/${imageId}`);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: {
          size: 3,
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          name: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    const mappedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    }));
    res.status(200).json(mappedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    const mappedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    }));
    res.status(200).json(mappedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    // Check Redis cache for featured products
    let featuredProducts = await redis.get("featuredProducts");

    if (featuredProducts) {
      // Parse and respond with cached products
      featuredProducts = JSON.parse(featuredProducts);
      return res.status(200).json(featuredProducts);
    }

    // Query the database for featured products
    featuredProducts = await Product.find({ featured: true }).lean();

    // Transform and cache the data
    const transformedProducts = featuredProducts.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    }));

    await redis.set("featuredProducts", JSON.stringify(transformedProducts));

    // Respond with the transformed products
    res.status(200).json(transformedProducts);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.featured = !product.featured;
    product.markModified("featured");
    await product.save();
    const featuredProducts = await Product.find(
      { featured: true },
      "-createdAt -updatedAt -__v -featured" // Fields to exclude
    ).lean();
    const transformedProducts = featuredProducts.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    }));

    await redis.set("featuredProducts", JSON.stringify(transformedProducts));

    res.status(200).json({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });
  } catch (error) {
    console.error("Error toggling featured:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
