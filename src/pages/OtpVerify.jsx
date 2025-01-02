import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// test passed
export const OtpVerify = () => {
  const navigate = useNavigate();
  const [laoding, setLoading] = useState(false);
  const [OTP, setOTP] = useState("");

  const confirmOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get("adminToken");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/account/signup/verifyOTP`,
        { otp: OTP },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert(`${response.data.message}\n${response.data.verification}`);
      setLoading(false);
      navigate("/admin/orders");
    } catch (error) {
      setLoading(false);
      console.log(error);

      // if anything goes wrong delete the tokens
      Cookies.remove("adminToken");
      Cookies.remove("adminRefreshToken");
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <input
          type="text"
          placeholder="Enter your OTP here..."
          value={OTP}
          onChange={(e) => setOTP(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={confirmOTP}
        >
          {laoding ? "confirming..." : "confirm OTP"}
        </button>
      </div>
    </div>
  );
};
