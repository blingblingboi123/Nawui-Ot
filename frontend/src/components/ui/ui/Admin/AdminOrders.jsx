import React, { useEffect, useState } from "react";
import api from "@/config/api";
import { toast } from "sonner";
import { authHeaders } from "@/config/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/order/all", { headers: authHeaders() });
      if (res.data.success) setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await api.put(
        `/api/v1/order/update-status/${orderId}`,
        { status },
        { headers: authHeaders() }
      );

      if (res.data.success) {
        toast.success("Order status updated");
        getAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

        {loading ? (
          <p className="text-center py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-bold text-lg">Order ID: {order._id}</h2>
                    <p className="text-sm text-gray-500">User: {order.user?.email || "Unknown user"}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="border rounded-lg px-4 py-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Processing">Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-orange-100 text-left">
                        <th className="p-3 border">Image</th>
                        <th className="p-3 border">Product</th>
                        <th className="p-3 border">Qty</th>
                        <th className="p-3 border">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products?.map((item, index) => (
                        <tr key={index}>
                          <td className="p-3 border">
                            <img
                              src={item.product?.productImg?.[0]?.url || "https://via.placeholder.com/100"}
                              alt={item.product?.productName || "Product"}
                              className="w-14 h-14 object-cover rounded-lg"
                            />
                          </td>
                          <td className="p-3 border">{item.product?.productName || "Product deleted"}</td>
                          <td className="p-3 border">{item.quantity}</td>
                          <td className="p-3 border">₹{item.product?.price || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-end">
                  <p className="font-bold text-lg">Total: ₹{order.amount}</p>
                </div>

                {order.delivery && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-semibold mb-1">Delivery Address</h3>
                    <p className="text-sm text-gray-700">
                      {order.delivery.fullName}, {order.delivery.phone}, {order.delivery.address}, {order.delivery.city}, {order.delivery.state} - {order.delivery.zip}
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

export default AdminOrders;
