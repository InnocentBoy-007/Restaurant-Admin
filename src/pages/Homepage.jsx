import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import primaryActions from "../services/PrimaryActions";

export default function Homepage() {
  const [laoding, setLoading] = useState(false);
  const [siginInLoading, setSignInLoading] = useState(false);
  const [forgotPasswordFlag, setForgotPasswordFlag] = useState(false);
  const [forgotPasswordOTPVerifyFlag, setForgotPasswordOTPVerifyFlag] =
    useState(false);
  const [changePasswordFlag, setChangePasswordFlag] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [otp, setOTP] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // if there is token available in cookies, the admin will be redirected to productpage
  // no need to signin again as long as there is a token inside cookies
  const tokenAvailable = () => {
    const token = Cookies.get("adminToken");
    if (token) {
      navigate("/admin/orders");
      return;
    }
  };

  useEffect(() => {
    tokenAvailable();
  }, []);

  const signUpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      adminDetails: {
        username,
        email,
        address,
        password,
        phoneNo,
        gender,
        age: parseInt(age),
      },
    };

    try {
      await primaryActions.signUp(body);
      setLoading(false);
      navigate("/admin/verify");
    } catch (error) {
      setLoading(false);
    }
  };

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  // function for signing in
  const signInHandler = async (e) => {
    e.preventDefault();
    setSignInLoading(true);
    const body = {
      adminDetails: {
        email: signInEmail,
        password: signInPassword,
      },
    };
    try {
      const response = await primaryActions.signIn(body);
      if (!response) return; // terminate the try block once the response went wrong
      setSignInEmail(""); // emptied the email for future use
      navigate("/admin/orders");
      setSignInLoading(false);
      // return { token };
    } catch (error) {
      setSignInLoading(false);
    }
  };

  const forgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = `${
      import.meta.env.VITE_BACKEND_API
    }/forgot-password/verify/email`;
    const data = {
      email: signInEmail,
    };

    try {
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
      });
      setSignInEmail("");
      setSignInPassword("");
      alert(response.data.message);
      setForgotPasswordOTPVerifyFlag(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyForgotPasswordOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = `${
      import.meta.env.VITE_BACKEND_API
    }/forgot-password/verify/otp`;
    const data = {
      otp,
    };

    try {
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data.message);
      setLoading(false);
      setChangePasswordFlag(true);
      setForgotPasswordOTPVerifyFlag(false);
      setForgotPasswordFlag(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const setNewPassword = async (e) => {
    e.preventDefault();

    // validator
    if (signInPassword !== confirmPassword) {
      console.log("Wrong password");

      return;
    }
    setLoading(true);

    const url = `${
      import.meta.env.VITE_BACKEND_API
    }/forgot-password/change-password`;
    const data = { newPassword: signInPassword };
    try {
      const response = await axios.patch(url, data, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data.message);
      setSignInPassword("");
      setChangePasswordFlag(false);
      setConfirmPassword(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {changePasswordFlag ? (
        <>
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h2 className="text-lg font-bold text-gray-700 mb-4">
                Change Password
              </h2>
              <form onSubmit={setNewPassword}>
                <div className="mb-4">
                  <input
                    type="password"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Enter the new password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Re-enter the new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="mt-2 text-center">
                  <button type="submit" className="rounded p-1 bg-blue-300">
                    {laoding ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
              <form onSubmit={signUpHandler}>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="phoneNo"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phoneNo"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="radio"
                        value="male"
                        checked={gender === "male"}
                        onChange={(e) => setGender(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        required
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="female"
                        checked={gender === "female"}
                        onChange={(e) => setGender(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        required
                      />
                      <span className="ml-2">Female</span>
                    </label>
                    {/* Add more options as needed */}
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="age"
                  >
                    Age
                  </label>
                  <input
                    type="text"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  {laoding ? "signing up..." : "sign up"}
                </button>
              </form>
            </div>
          </div>

          {/**Sign in */}
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              {forgotPasswordFlag ? (
                <>
                  {forgotPasswordOTPVerifyFlag ? (
                    <>
                      <h1 className="text-center mb-6">Verify otp</h1>
                      <form onSubmit={verifyForgotPasswordOTP}>
                        <input
                          type="text"
                          id="otp"
                          value={otp}
                          placeholder="Enter the OTP"
                          onChange={(e) => setOTP(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <div className="flex justify-center mt-2">
                          <button
                            className="p-1 bg-blue-300 rounded"
                            type="submit"
                          >
                            {laoding ? "Confirming..." : "Confirm OTP"}
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <h1 className="text-center mb-6">Forgot Password?</h1>
                      <form onSubmit={forgotPassword}>
                        <input
                          type="email"
                          id="email"
                          value={signInEmail}
                          placeholder="Enter your email to send OTP"
                          onChange={(e) => setSignInEmail(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <div className="flex justify-between mt-2 mx-2">
                          <button className="p-1 bg-blue-300 rounded">
                            {laoding ? "Sending..." : "Send"}
                          </button>
                          <button
                            className="p-1 bg-red-300 rounded"
                            onClick={() => setForgotPasswordFlag(false)}
                            type="submit"
                          >
                            Close
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-center mb-6">
                    Sign In
                  </h2>
                  <form onSubmit={signInHandler}>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
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
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
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
                      {siginInLoading ? "signing in..." : "sign in"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
