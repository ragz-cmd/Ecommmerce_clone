/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../store/userStore";
import { useCartStore } from "../store/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      addToCart(product); // Replace with add-to-cart functionality
    }
  };

  return (
    <div
      className="flex w-full relative flex-col overflow-hidden rounded-lg border border-slate-400 shadow-lg bg-gray-400 bg-opacity-50 backdrop-blur-md
"
    >
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt="product image"
        />
        <div
          className="absolute inset-0 bg-black bg-opacity-40
"
        />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-slate-900">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-700">
              ${product.price}
            </span>
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-lg bg-slate-700 px-5 py-2.5 text-center text-sm font-medium
            text-white hover:bg-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-300"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
