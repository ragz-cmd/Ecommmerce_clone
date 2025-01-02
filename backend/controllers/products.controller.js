import Product from "../models/products.model.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      return res.status(200).json(JSON.parse(featuredProducts));
    }
    featuredProducts = await Product.find({ featured: true }).lean();
    res.status(200).json(featuredProducts);
    if (!featuredProducts) {
      return res
        .status(404)
        .json({ message: "No featured featuredProducts found" });
    }
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
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
    res.status(201).json(product);
  } catch (error) {
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
    res.status(200).json(product);
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
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.featured = !product.featured;
    await product.save();
    const featuredProducts = await Product.find({ featured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
