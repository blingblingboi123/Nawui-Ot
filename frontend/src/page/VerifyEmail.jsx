import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/config/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.post(
          "/api/v1/user/verify",
          { token },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setStatus("✅ Email Verified Successfully");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        setStatus("❌ Verification failed. Please try again");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("❌ Invalid verification link");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <p className="text-gray-600 mb-6">{status}</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;