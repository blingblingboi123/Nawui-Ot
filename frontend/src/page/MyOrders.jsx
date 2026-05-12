import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_URL, authHeaders } from "@/config/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMyOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/order/my-orders`, {
        headers: authHeaders(),
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-orange-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={60} />
            <h2 className="text-2xl font-semibold text-gray-700">
              No Orders Yet
            </h2>
            <p className="text-gray-500 mt-2">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 mb-4">
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">
                      Order #{index + 1}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <span className="text-green-600 font-medium">
                        {order.status || "Paid"}
                      </span>
                    </p>

                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="font-bold text-orange-500 text-lg mt-3 md:mt-0">
                    ₹{order.totalPrice || order.amount || 0}
                  </p>
                </div>

                <div className="space-y-4">
                  {order.products?.map((item, idx) => {
                    const product = item.product;

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 border rounded-xl p-3"
                      >
                        <img
                          src={
                            product?.productImg?.[0]?.url ||
                            "https://via.placeholder.com/100"
                          }
                          alt={product?.productName || "Product"}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {product?.productName || "Product deleted"}
                          </h3>

                          <p className="text-gray-500 text-sm">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-orange-500 font-medium">
                            ₹{product?.price || item.price || 0}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;