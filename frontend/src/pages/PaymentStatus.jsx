import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../lib/axios"; // Axios instance pointing to your backend
import { CheckCircle, XCircle } from "lucide-react";

const PaymentStatus = () => {
  const [status, setStatus] = useState(null); // 'success' or 'failure'
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}`); // Backend endpoint
        setOrderDetails(response.data);
        setStatus("success");
      } catch (error) {
        console.error("Error fetching order details:", error);
        setStatus("failure");
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  if (status === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {status === "success" ? (
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-semibold text-gray-800 mt-4">
            Payment Successful
          </h1>
          <p className="text-gray-600 mt-2">
            Order ID:{" "}
            <span className="font-semibold">{orderDetails?.orderId}</span>
          </p>
          <p className="text-gray-600">
            Amount Paid:{" "}
            <span className="font-semibold">
              ₹{orderDetails?.totalPrice / 100}
            </span>
          </p>
          <button
            onClick={handleContinueShopping}
            className="mt-6 w-full bg-emerald-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-emerald-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-semibold text-gray-800 mt-4">
            Payment Failed
          </h1>
          <p className="text-gray-600 mt-2">
            Something went wrong with your payment. Please try again or contact
            support.
          </p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleGoToCart}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600"
            >
              Go to Cart
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
