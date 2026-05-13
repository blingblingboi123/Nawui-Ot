import React, { useState } from "react";
import api from "@/config/api";
import { toast } from "sonner";

const Verify = () => {
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("verifyEmail");

  const resendHandler = async () => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/api/v1/user/reverify",
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Verification email sent again");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to resend email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">✅ Check Your Email</h2>
        <p className="text-gray-600 mb-6">
          We have sent you a verification email. Please check your inbox and click the link to verify your account.
        </p>
        <button
          onClick={resendHandler}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>
      </div>
    </div>
  );
};

export default Verify;