import React, { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import api from "@/config/api";
import { API_URL } from "@/config/api";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductDesc = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const res = await api.post(
        `${API_URL}/cart/add`,
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Added to cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add");
    }
  };

  if (!product) return null;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title */}
      <h1 className="font-bold text-3xl md:text-4xl text-gray-800">
        {product.productName}
      </h1>

      {/* Price */}
      <p className="text-2xl font-bold text-green-600">
        ₹{product.price}
      </p>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {product.productDescription}
      </p>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-medium">Quantity:</span>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            onClick={decreaseQty}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
          >
            <Minus size={16} />
          </button>

          <span className="px-4">{quantity}</span>

          <button
            onClick={increaseQty}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={addToCart}
        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        <ShoppingCart size={20} />
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDesc;