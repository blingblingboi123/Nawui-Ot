import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  UserRound,
  CalendarDays,
  ShoppingBag,
  Users,
  Save,
} from "lucide-react";

const UserInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipcode: "",
    phoneNo: "",
    role: "user",
    isVerified: false,
    createdAt: "",
  });

  const token = localStorage.getItem("accessToken");

  const getUserInfo = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/user/get-User/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const u = res.data.user;

        setUpdatedUser({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          address: u.address || "",
          city: u.city || "",
          zipcode: u.zipcode || "",
          phoneNo: u.phoneNo || "",
          role: u.role || "user",
          isVerified: u.isVerified || false,
          createdAt: u.createdAt || "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [id]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_URL}/user/update/${id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("User updated successfully");
        navigate("/dashboard/user");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const joinedDate = updatedUser.createdAt
    ? new Date(updatedUser.createdAt).toLocaleDateString()
    : "Not available";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="w-14 h-14 rounded-xl bg-white border shadow-sm flex items-center justify-center hover:bg-slate-100"
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-4xl font-bold text-slate-900">User Info</h1>
              <p className="text-slate-500 mt-1">View and update user profile</p>
            </div>
          </div>

          <div className="flex gap-3">


            <button
              onClick={() => navigate(`/dashboard/user-orders/${id}`)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-pink-600 text-white shadow-sm hover:bg-pink-700 font-medium"
            >
              <ShoppingBag size={18} />
              View Orders
            </button>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white border rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-pink-100 flex items-center justify-center">
                <UserRound className="text-pink-600" size={54} />
              </div>

              <div className="min-w-0">
                <h2
                  className="text-3xl font-bold text-slate-900 truncate max-w-[500px]"
                  title={`${updatedUser.firstName} ${updatedUser.lastName}`}
                >
                  {updatedUser.firstName} {updatedUser.lastName}
                </h2>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      updatedUser.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {updatedUser.isVerified ? "Verified" : "Not Verified"}
                  </span>

                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                    {updatedUser.role}
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-slate-600">
                  <p className="flex items-center gap-2 break-all">
                    <Mail size={17} />
                    {updatedUser.email || "No email"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={17} />
                    {updatedUser.phoneNo || "No phone number"}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={17} />
                    Joined on {joinedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:border-l lg:pl-10 space-y-4 min-w-[220px]">
              <InfoSmall title="Role" value={updatedUser.role} icon={<Shield />} />
              <InfoSmall title="User ID" value={id} />
              <InfoSmall
                title="Status"
                value={updatedUser.isVerified ? "Active" : "Pending"}
              />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Profile Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-5">
              <InputBox
                label="First Name"
                name="firstName"
                value={updatedUser.firstName}
                onChange={changeHandler}
              />

              <InputBox
                label="Last Name"
                name="lastName"
                value={updatedUser.lastName}
                onChange={changeHandler}
              />

              <InputBox
                label="Email"
                name="email"
                value={updatedUser.email}
                readOnly
              />
            </div>

            <InputBox
              label="Address"
              name="address"
              value={updatedUser.address}
              onChange={changeHandler}
            />

            <div className="grid md:grid-cols-3 gap-5">
              <InputBox
                label="City"
                name="city"
                value={updatedUser.city}
                onChange={changeHandler}
              />

              <InputBox
                label="Zipcode"
                name="zipcode"
                value={updatedUser.zipcode}
                onChange={changeHandler}
              />

              <InputBox
                label="Phone Number"
                name="phoneNo"
                value={updatedUser.phoneNo}
                onChange={changeHandler}
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-slate-700">
                Role
              </label>
              <select
                name="role"
                value={updatedUser.role}
                onChange={changeHandler}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-60"
            >
              <Save size={18} />
              {loading ? "Please wait..." : "Update Account"}
            </button>
          </form>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-slate-700">
          <p className="font-semibold">Note</p>
          <p className="text-sm mt-1">
            You can update user information and role. Email is shown as read-only
            for safety.
          </p>
        </div>
      </div>
    </div>
  );
};

const InputBox = ({ label, name, value, onChange, readOnly = false }) => {
  return (
    <div>
      <label className="block mb-2 font-semibold text-slate-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full border rounded-xl px-4 py-3 outline-none ${
          readOnly
            ? "bg-slate-100 text-slate-500 cursor-not-allowed"
            : "bg-white focus:ring-2 focus:ring-pink-400"
        }`}
      />
    </div>
  );
};

const InfoSmall = ({ title, value, icon }) => {
  return (
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="font-bold text-slate-900 break-all flex items-center gap-2">
        {icon && <span className="text-pink-600">{icon}</span>}
        {value || "Not available"}
      </p>
    </div>
  );
};

export default UserInfo;