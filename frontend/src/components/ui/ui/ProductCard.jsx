import React from "react";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "@/redux/cartSlice";

const ProductCard = ({ product, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  if (loading) {
    return (
      <div className="shadow-lg rounded-lg overflow-hidden bg-white p-4 space-y-3">
        <Skeleton className="w-full h-48 rounded-md" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  const { productName, price, productImg, _id } = product;

  const addToCart = async (productId) => {
    try {
      if (!accessToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${API_URL}/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product added to cart");
        dispatch(setCart(res.data.cart));
      } else {
        toast.error(res.data.message || "Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition duration-300">
      <div className="w-full h-48 bg-gray-200">
        <img
          onClick={() => navigate(`/products/${_id}`)}
          src={productImg?.[0]?.url || "https://via.placeholder.com/300"}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {productName}
          </h2>

          <span className="text-lg font-bold text-green-600">₹{price}</span>

          <button
            onClick={() => addToCart(_id)}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
