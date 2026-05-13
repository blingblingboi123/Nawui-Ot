import React, { useEffect, useState } from "react";
import api from "@/config/api";
import {
  ShoppingBag,
  IndianRupee,
  Package,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { authHeaders } from "@/config/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminSales = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSalesData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/v1/order/sales-data",authHeaders());

      if (res.data.success) {
        setSalesData(res.data.salesData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch sales data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSalesData();
  }, []);

  const monthlyChartData = salesData?.monthlySales
    ? Object.entries(salesData.monthlySales).map(([month, amount]) => ({
        month,
        sales: amount,
      }))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Sales Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Orders</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {salesData?.totalOrders || 0}
              </h2>
            </div>
            <div className="bg-orange-100 p-4 rounded-full">
              <ShoppingBag className="text-orange-500" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                ₹{salesData?.totalRevenue || 0}
              </h2>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <IndianRupee className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Products Sold</p>
              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                {salesData?.totalProductsSold || 0}
              </h2>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <Package className="text-blue-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Monthly Sales Chart
        </h2>

        {monthlyChartData.length > 0 ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="sales" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500">No monthly sales data available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSales;