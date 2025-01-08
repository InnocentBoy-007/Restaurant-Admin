// if the email is changed, sent an OTP to confirm it

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import secondaryActions from "../../services/SecondaryActions";

export default function PersonalDetails() {
  const navigate = useNavigate();
  const token = Cookies.get("adminToken");

  if (!token) {
    navigate("/");
  }

  const [adminDetails, setAdminDetails] = useState({});
  const [initialAdminDetails, setInitialAdminDetails] = useState({}); // Store initial state

  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [deleteAccountFlag, setDeleteAccountFlag] = useState(false);
  const [editAccountFlag, setEditAccountFlag] = useState(false);
  const [editPasswordFlag, setEditPasswordFlag] = useState(false);

  const fetchAdminDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/v1/admin/user-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setLoading(false);
      setAdminDetails(response.data.adminDetails);
      setInitialAdminDetails(response.data.adminDetails); // Set initial state
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  };

  // function to delete account
  const deleteAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await secondaryActions.DeleteAccount(
        { password },
        token
      );
      if (response.success) {
        Cookies.remove("adminToken");
        Cookies.remove("adminRefreshToken");
        navigate("/");
      }
    } finally {
      setPassword("");
      setDeleteAccountFlag(false);
      setLoading(false);
    }
  };

  // function to update account
  const updateAccount = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      const data = {
        updateDetails: {
          username: adminDetails.username,
          email: adminDetails.email,
          phoneNo: adminDetails.phoneNo,
          gender: adminDetails.gender,
          age: parseInt(adminDetails.age),
        },
      };

      try {
        await secondaryActions.UpdateAccount(data, token);
        setEditAccountFlag(false);
        setInitialAdminDetails(adminDetails); // Update initial state after saving
      } finally {
        setLoading(false);
      }
    },
    [adminDetails, token, setLoading, setEditAccountFlag]
  );

  // function to changePassword
  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
      return alert(
        "Error! The confirm password must be same as the new password!"
      );
    }

    const URL = `${
      import.meta.env.VITE_BACKEND_API
    }/v1/admin/password/change-password`;

    try {
      const response = await axios.patch(
        URL,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      alert(response.data.message);
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
      setEditPasswordFlag(false);
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message);
      }
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
      setEditPasswordFlag(false);
    }
  };

  // Function to check if there are any changes
  const hasChanges = () => {
    return JSON.stringify(adminDetails) !== JSON.stringify(initialAdminDetails);
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    <>
      <div className="m-3">
        <button
          className="w-32 bg-red-800 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition duration-200"
          onClick={() => navigate("/admin/orders")}
        >
          Back
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <h2>Loading</h2>
        </div>
      ) : (
        <>
          <div className="m-4">
            <div className="flex justify-between items-center">
              <h1>{adminDetails.username}</h1>
              <button
                className="w-32 bg-red-800 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition duration-200"
                onClick={() => setDeleteAccountFlag(true)}
              >
                Delete Account
              </button>
            </div>
            <div className="mt-5 pl-5 flex flex-col">
              {adminDetails ? (
                <div className="h-[60vh] flex flex-col justify-between">
                  <h2>Account Id: {adminDetails._id}</h2>
                  <h2>Email: {adminDetails.email}</h2>
                  <h2>Phone No: {adminDetails.phoneNo}</h2>
                  <h2>Gender: {adminDetails.gender}</h2>
                  <h2>Age: {adminDetails.age}</h2>
                  <h2>
                    Account Created At: {adminDetails.createdAtLocaleTime}
                  </h2>
                  {!adminDetails.updatedAtLocaleTime ? (
                    <></>
                  ) : (
                    <h2>
                      Account Updated At: {adminDetails.updatedAtLocaleTime}
                    </h2>
                  )}
                </div>
              ) : (
                <div>
                  <h1>No Details!</h1>
                </div>
              )}
              {editAccountFlag ? (
                <>
                  <div className="fixed inset-0 bg-white flex justify-center bg-opacity-100 z-50">
                    <div className="mt-20">
                      <div className="flex justify-center">
                        <h2>Update profile</h2>
                      </div>
                      <form className="mt-5" onSubmit={updateAccount}>
                        <input
                          type="text"
                          id="username"
                          placeholder="Username"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                          value={adminDetails.username}
                          onChange={(e) =>
                            setAdminDetails({
                              ...adminDetails,
                              username: e.target.value,
                            })
                          }
                          required
                        />
                        <input
                          type="email"
                          id="email"
                          placeholder="email"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                          value={adminDetails.email}
                          onChange={(e) =>
                            setAdminDetails({
                              ...adminDetails,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                        <input
                          type="text"
                          id="phone"
                          placeholder="phone"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                          value={adminDetails.phoneNo}
                          onChange={(e) =>
                            setAdminDetails({
                              ...adminDetails,
                              phoneNo: e.target.value,
                            })
                          }
                          required
                        />
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Gender
                          </label>
                          <div className="mt-1">
                            <label className="inline-flex items-center mr-4">
                              <input
                                type="radio"
                                value="male"
                                checked={adminDetails.gender === "male"}
                                onChange={(e) =>
                                  setAdminDetails({
                                    ...adminDetails,
                                    gender: e.target.value,
                                  })
                                }
                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                required
                              />
                              <span className="ml-2">Male</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                value="female"
                                checked={adminDetails.gender === "female"}
                                onChange={(e) =>
                                  setAdminDetails({
                                    ...adminDetails,
                                    gender: e.target.value,
                                  })
                                }
                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                required
                              />
                              <span className="ml-2">Female</span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          id="age"
                          placeholder="age"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                          value={adminDetails.age}
                          onChange={(e) =>
                            setAdminDetails({
                              ...adminDetails,
                              age: e.target.value,
                            })
                          }
                          required
                        />
                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="mt-5 w-32 bg-red-700 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition duration-200"
                            onClick={() => setEditAccountFlag(false)}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="mt-5 w-32 bg-green-700 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-green-200"
                            disabled={!hasChanges()} // Disable if no changes
                          >
                            {loading ? "saving..." : "save"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="m-10 flex justify-between">
                    <button
                      className="w-32 bg-blue-500 text -white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                      onClick={() => setEditAccountFlag(true)}
                    >
                      Edit Account
                    </button>
                    <button
                      className="w-40 bg-blue-500 text -white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                      onClick={() => setEditPasswordFlag(true)}
                    >
                      Change Password
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {deleteAccountFlag && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-lg font-semibold mb-4">
                  Are you sure you want to delete your account?
                </h1>
                <form onSubmit={deleteAccount}>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter your password to confirm:
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button" // Use type="button" to prevent form submission
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      onClick={() => setDeleteAccountFlag(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-red-800 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-red-300"
                      disabled={!password} // Disable the button if password is empty
                    >
                      Delete
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {editPasswordFlag && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-lg font-semibold mb-4">
                  Are you sure you want to change your account's password?
                </h1>
                <form onSubmit={changePassword}>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter a new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                  <input
                    type="password"
                    id="confirmpassword"
                    placeholder="Re-Enter the new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button" // Use type="button" to prevent form submission
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      onClick={() => setEditPasswordFlag(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-200"
                      disabled={!password || !confirmPassword} // Disable the button if password is empty
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
