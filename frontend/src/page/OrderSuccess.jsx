import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <CheckCircle className="mx-auto text-green-500" size={70} />

        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Order Successful!
        </h1>

        <p className="text-gray-600 mt-3">
          Thank you for your order. Your payment has been completed successfully.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link to="/" className="bg-green-500 text-white py-2 rounded-lg">
            Go to Home
          </Link>

          <Link
            to="/products"
            className="border border-green-500 text-green-600 py-2 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;