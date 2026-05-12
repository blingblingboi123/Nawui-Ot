import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const ShowUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { userId } = useParams();

  const token = localStorage.getItem("accessToken");

  const getUserOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/order/user-orders/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch user orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-6">
          User Orders
        </h1>

        {loading ? (
          <p className="text-center py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No orders found.
          </p>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-xl p-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

                  <div>
                    <h2 className="font-bold text-lg">
                      Order ID: {order._id}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <p className="text-sm font-medium mt-1">
                      Status:
                      <span className="ml-2 text-orange-500">
                        {order.status}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-xl">
                      ₹{order.amount}
                    </p>
                  </div>

                </div>

                {/* PRODUCTS */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">

                    <thead>
                      <tr className="bg-orange-100 text-left">
                        <th className="p-3 border">Image</th>
                        <th className="p-3 border">Product</th>
                        <th className="p-3 border">Qty</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.products?.map((item, index) => (
                        <tr key={index}>

                          <td className="p-3 border">
                            <img
                              src={
                                item.product?.productImg?.[0]?.url ||
                                "https://via.placeholder.com/100"
                              }
                              alt={item.product?.productName}
                              className="w-14 h-14 object-cover rounded-lg"
                            />
                          </td>

                          <td className="p-3 border">
                            {item.product?.productName ||
                              "Product deleted"}
                          </td>

                          <td className="p-3 border">
                            {item.quantity}
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

                {/* ADDRESS */}
                {order.delivery && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">
                      Delivery Address
                    </h3>

                    <p className="text-sm text-gray-700">
                      {order.delivery.fullName}
                    </p>

                    <p className="text-sm text-gray-700">
                      {order.delivery.phone}
                    </p>

                    <p className="text-sm text-gray-700">
                      {order.delivery.address},{" "}
                      {order.delivery.city},{" "}
                      {order.delivery.state} -{" "}
                      {order.delivery.zip}
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ShowUserOrders;