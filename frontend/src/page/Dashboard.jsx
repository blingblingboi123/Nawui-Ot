import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  PlusCircle,
  Package,
  ClipboardList,
  Users,
  LayoutDashboard,
} from "lucide-react";

const Dashboard = () => {
  const links = [
    { name: "Sales", path: "/dashboard/sales", icon: <BarChart3 size={20} /> },
    { name: "Add Product", path: "/dashboard/add-product", icon: <PlusCircle size={20} /> },
    { name: "Products", path: "/dashboard/products", icon: <Package size={20} /> },
    { name: "Orders", path: "/dashboard/orders", icon: <ClipboardList size={20} /> },
    { name: "Users", path: "/dashboard/user", icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md p-5">
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard className="text-orange-500" />
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>

        <div className="space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-100"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-2xl shadow min-h-[80vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;