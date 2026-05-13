import React from "react";
import api from "@/config/api";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setCart } from "@/redux/cartSlice";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL, authHeaders } from "@/config/api";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store.cart);
  const navigate = useNavigate();

  const updateQuantity = async (productId, type) => {
    if (!productId) return;

    try {
      const res = await api.put(
        `${API_URL}/cart/update`,
        { productId, type },
        { headers: authHeaders() }
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success(res.data.message || "Cart updated");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;

    try {
      const res = await api.delete(`${API_URL}/cart/remove`, {
        data: { productId },
        headers: authHeaders(),
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500 mt-2 mb-4">Add some products to see them here.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
          >
            Add Items
          </button>
        </div>
      </div>
    );
  }

  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice =
    cart.totalPrice ||
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-5">
          <h1 className="text-2xl font-bold mb-6">My Cart</h1>

          <div className="space-y-5">
            {cart.items.map((item) => {
              const product = item.productId;

              return (
                <div
                  key={product?._id || item._id}
                  className="flex flex-col sm:flex-row gap-4 border-b pb-5"
                >
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product?.productImg?.[0]?.url || "https://via.placeholder.com/150"}
                      alt={product?.productName || "product"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {product?.productName || "Product"}
                      </h2>
                      <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product?._id, "decrease")}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-4 py-2 font-medium">{item.quantity}</span>

                        <button
                          onClick={() => updateQuantity(product?._id, "increase")}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product?._id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-semibold text-gray-800">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between text-gray-600 mb-3">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="flex justify-between text-lg font-bold border-t pt-4">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          <button
            className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium"
            onClick={() => navigate("/address")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
