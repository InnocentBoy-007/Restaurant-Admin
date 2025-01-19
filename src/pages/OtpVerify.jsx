import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../components/IsTokenExpired";
import { RefreshToken } from "../components/RefreshToken";

// test passed
export const OtpVerify = () => {
  let [token, setToken] = useState(Cookies.get("adminToken"));
  const refreshToken = Cookies.get("adminRefreshToken");
  const navigate = useNavigate();
  const [laoding, setLoading] = useState(false);
  const [OTP, setOTP] = useState("");

  useEffect(() => {
    if (!Cookies.get("adminToken")) {
      navigate("/");
      console.log("You need to login or sign up first!");
    }
  }, []);

  const confirmOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (refreshToken && isTokenExpired(token)) {
      const newToken = await RefreshToken(refreshToken);
      setToken(newToken.token);
      Cookies.set("adminToken", newToken.token);
    }

    const URL = `${import.meta.env.VITE_BACKEND_API}/account/signup/verifyOTP`;

    try {
      if (token) {
        const response = await axios.post(
          URL,
          { otp: OTP },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        alert(response.data.message);
        setLoading(false);
        navigate("/admin/orders");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);

      // if anything goes wrong delete the tokens
      Cookies.remove("adminToken");
      Cookies.remove("adminRefreshToken");
      navigate("/admin/signup");
      if (error.response) {
        alert(`${error.response.data.message}. Please signup again!`);
      } else if (error.request) {
        alert("Network error! Please try again later!");
      } else {
        console.log(
          "An unexpected error occured while trying to confirm the OTP!"
        );
      }
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <form onSubmit={confirmOTP}>
          <input
            type="text"
            placeholder="Enter your OTP here..."
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            type="submit"
            onClick={confirmOTP}
          >
            {laoding ? "confirming..." : "confirm OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};
