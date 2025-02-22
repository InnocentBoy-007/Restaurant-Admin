import React from "react";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import primaryActions from "../services/PrimaryActions";
import forgotPassword from "../components/PasswordManagement";
import { isTokenExpired } from "../components/IsTokenExpired";
import { RefreshToken } from "../components/RefreshToken";

export default function SignIn() {
  let [token, setToken] = useState(Cookies.get("adminToken"));
  const refreshToken = Cookies.get("clientRefreshToken");

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordFlag, setForgotPasswordFlag] = useState(false);
  const [otpVerifyFlag, setOtpVerifyFlag] = useState(false);
  const [newPasswordFlag, setNewPasswordFlag] = useState(false);

  useEffect(() => {
    if(Cookies.get("adminToken")) navigate("/admin/orders");
  }, []);

  const checkToken = async () => {
    if (refreshToken && isTokenExpired(token)) {
      const newToken = await RefreshToken(refreshToken);
      setToken(newToken.token);
      Cookies.set("adminToken", newToken.token);
      navigate("/admin/orders");
    }
  };

  const resetForm = () => {
    setEmail("");
    setPhoneNo("");
    setPassword("");
    setLoading(false);
  };

  // function for signing in
  const signInHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      adminDetails: {
        email,
        phoneNo,
        password,
      },
    };

    try {
      const response = await primaryActions.signIn(data);
      if (response.success) {
        Cookies.set("adminToken", response.token);
        Cookies.set("adminRefreshToken", response.refreshToken);
        resetForm();
        navigate("/admin/orders");
      }
    } catch (error) {
      // keep the email as it is
      setLoading(false);
      setPassword("");
    }
  };

  // function for requesting otp
  const requestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword.requestOTP({ email });
      if (response.success) {
        Cookies.set("adminToken", response.token);
        Cookies.set("adminRefreshToken", response.refreshToken);
        setLoading(false);
        setEmail("");
        setOtpVerifyFlag(true);
      }
    } catch (error) {
      setEmail("");
      setLoading(false);
    }
  };

  // function to confirm otp
  const confirmOTP = async (e) => {
    await checkToken();
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword.confirmOTP({ otp }, token);
      if (response) {
        setLoading(false);
        setForgotPasswordFlag(false);
        setNewPasswordFlag(true);
        setOtpVerifyFlag(false);
      }
    } catch (error) {
      setLoading(false);
      setOtp("");
      Cookies.remove("clientToken");
      Cookies.remove("clientRefreshToken");
    }
  };

  // function to set new password
  const changePassword = async (e) => {
    await checkToken();
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      return alert("The confirm password does not match!");
    }

    try {
      const response = await forgotPassword.changePassword(
        { newPassword },
        token
      );
      if (response) {
        setLoading(false);
        setPassword("");
        setConfirmPassword("");
        setNewPasswordFlag(false);
      }
    } catch (error) {
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {newPasswordFlag ? (
          <>
            <form onSubmit={changePassword}>
              <div className="mb-4">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter a new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
                <input
                  type="password"
                  id="confirmpassword"
                  placeholder="Re-enter the new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <button type="submit" className="rounded p-1 bg-blue-300">
                {loading ? "saving..." : "save"}
              </button>
            </form>
          </>
        ) : (
          <>
            {otpVerifyFlag ? (
              <div>
                <form onSubmit={confirmOTP}>
                  <div className="mb-4">
                    <input
                      type="text"
                      id="otp"
                      placeholder="Enter the otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                      required
                    ></input>
                    <div className="flex justify-between mt-4">
                      <button type="submit" className="rounded p-1 bg-blue-300">
                        {loading ? "confirming..." : "confirm"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                {forgotPasswordFlag ? (
                  <>
                    <form onSubmit={requestOTP}>
                      <div className="mb-4">
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor="email"
                        >
                          Enter your email to get OTP
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                          required
                        ></input>
                        <div className="flex justify-between mt-4">
                          <p>Sign In</p>
                          <button
                            type="submit"
                            className="rounded p-1 bg-blue-300"
                          >
                            {loading ? "requesting otp..." : "request otp"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-center mb-6">
                      Sign In
                    </h2>
                    <form onSubmit={signInHandler}>
                      <div className="mb-4">
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor="emailorusername"
                        >
                          Email or Phone
                        </label>
                        <input
                          type="text"
                          id="emailorphone"
                          value={email || phoneNo}
                          onChange={(e) => {
                            if (e.target.value.includes("@")) {
                              setEmail(e.target.value);
                              setPhoneNo("");
                            } else {
                              setPhoneNo(e.target.value);
                              setEmail("");
                            }
                          }}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                          required
                        />
                      </div>
                      <p
                        className="italic cursor-pointer inline-block"
                        onClick={() => setForgotPasswordFlag(true)}
                      >
                        Forgot password
                      </p>
                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-200"
                      >
                        {loading ? "signing in..." : "sign in"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {!forgotPasswordFlag && (
          <>
            <p className="text-sm text-gray-500 mt-5">
              Don't have an account?{" "}
              <span
                className="font-bold cursor-pointer"
                onClick={() => navigate("/admin/signup")}
              >
                Sign Up
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
