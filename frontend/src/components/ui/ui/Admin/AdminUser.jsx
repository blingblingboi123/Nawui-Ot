import axios from "axios";
import { API_URL } from "@/config/api";
import React, { useEffect, useMemo, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { Input } from "../Input";
import { Button } from "../button";
import { Eye, Loader2, Shield, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(`${API_URL}/user/allUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`;

      return (
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.role?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                User Management
              </h1>
              <p className="text-slate-500 mt-1">
                View, search and manage registered users
              </p>
            </div>

            <div className="bg-slate-100 rounded-xl px-5 py-3">
              <p className="text-sm text-slate-500">Total Users</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {users.length}
              </h2>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-6 max-w-md">
            <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200"
              type="text"
              placeholder="Search by name, email or role..."
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              <Loader2 className="animate-spin mr-2" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">
              No users found
            </div>
          ) : (
            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-100 text-sm font-semibold text-slate-600">
                <div className="col-span-4">User</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-t items-center hover:bg-slate-50 transition"
                >
                  <div className="md:col-span-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center">
                      <UserRound className="text-pink-600" size={22} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900 truncate max-w-[180px]">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-slate-500 md:hidden truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-4 hidden md:block text-slate-600 truncate">
                    {user.email}
                  </div>

                  <div className="md:col-span-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <Shield size={13} />
                      {user.role}
                    </span>
                  </div>

                  <div className="md:col-span-2 flex md:justify-end">
                    <Button
                      onClick={() => navigate(`/dashboard/user/${user._id}`)}
                      className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white"
                    >
                      <Eye size={16} />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
