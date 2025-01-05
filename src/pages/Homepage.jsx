import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import primaryActions from "../services/PrimaryActions";

export default function Homepage() {
  const [laoding, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

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

    const data = {
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
      await primaryActions.signUp(data);
      setLoading(false);
      navigate("/admin/verify");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
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
            <p className="text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <span
                className="font-bold cursor-pointer"
                onClick={() => navigate("/admin/signIn")}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </>
    </>
  );
}
