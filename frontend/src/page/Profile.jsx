import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { API_URL } from "@/config/api";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const storedUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw && raw !== "undefined" ? JSON.parse(raw) : {};
    } catch {
      localStorage.removeItem("user");
      return {};
    }
  })();

  const realUser = user || storedUser;
  const realUserId = userId || realUser?.id;

  const [updatedUser, setUpdatedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    zipcode: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!realUser) return;

    setUpdatedUser({
      firstName: realUser.firstName || "",
      lastName: realUser.lastName || "",
      email: realUser.email || "",
      phoneNo: realUser.phoneNo || "",
      address: realUser.address || "",
      zipcode: realUser.zipcode || "",
    });
  }, [user]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Token not found. Please login again.");
      return;
    }

    if (!realUserId) {
      toast.error("User ID not found.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_URL}/user/update/${realUserId}`,
        {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phoneNo: updatedUser.phoneNo,
          address: updatedUser.address,
          zipcode: updatedUser.zipcode,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        const newUserData = {
          ...realUser,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phoneNo: updatedUser.phoneNo,
          address: updatedUser.address,
          zipcode: updatedUser.zipcode,
        };

        dispatch(setUser(newUserData));
        localStorage.setItem("user", JSON.stringify(newUserData));

        toast.success("Profile updated successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!realUser?.id) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 px-4">
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-3">No user data found</h1>
          <p className="text-gray-600">Please login again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={updatedUser.firstName}
                onChange={changeHandler}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={updatedUser.lastName}
                onChange={changeHandler}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={updatedUser.email}
              readOnly
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={updatedUser.address}
              onChange={changeHandler}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Zipcode</label>
              <input
                type="text"
                name="zipcode"
                value={updatedUser.zipcode}
                onChange={changeHandler}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone Number</label>
              <input
                type="text"
                name="phoneNo"
                value={updatedUser.phoneNo}
                onChange={changeHandler}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Updating..." : "Update Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;