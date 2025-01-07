import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import secondaryActions from "../../services/SecondaryActions";

/**
 * for adding a mechanism to retrieve a new token using a refresh token, refer to the order page (order.jsx)
 */

export default function PersonalDetails() {
  const navigate = useNavigate();
  const token = Cookies.get("adminToken");
  // const refreshToken = Cookies.get("adminRefreshToken"); // add later

  if (!token) {
    navigate("/");
  }

  const [adminDetails, setAdminDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");

  // flags
  const [editAccountFlag, setEditAccountFlag] = useState(false);
  const [deleteAccountFlag, setDeleteAccountFlag] = useState(false);

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
      setAdminDetails(response.data.adminDetails);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
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
                  <button
                    className="mt-5 w-32 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    onClick={() => setEditAccountFlag(false)}
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="mt-5 w-32 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    onClick={() => setEditAccountFlag(true)}
                  >
                    Edit Account
                  </button>
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
        </>
      )}
    </>
  );
}
