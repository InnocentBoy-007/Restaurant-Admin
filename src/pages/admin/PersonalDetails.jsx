import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PersonalDetails() {
  const navigate = useNavigate();
  const token = Cookies.get("adminToken");

  if (!token) {
    navigate("/");
  }

  const [adminDetails, setAdminDetails] = useState({});
  const [adminAccountEdit, setAdminAccountEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deleteAccountFlag, setDeleteAccountFlag] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  const fetchAdminDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/admin/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setAdminDetails(response.data.adminDetails);
      setName(response.data.adminDetails.name);
      setEmail(response.data.adminDetails.email);
      setPhoneNo(response.data.adminDetails.phoneNo);
      setGender(response.data.adminDetails.gender);
      setAddress(response.data.adminDetails.address);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const deleteAccount = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/admin/details/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      Cookies.remove("adminToken");
      Cookies.remove("adminRefreshToken");
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearAllInputFields = () => {
    setName("");
    setEmail("");
    setPhoneNo("");
    setGender("");
    setAddress("");
  };

  const saveNewAdminDetails = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_API}/admin/details/update`,
        { adminDetails: { name, email, phoneNo, gender, address } },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      alert(response.data.message);
      setAdminAccountEdit(false);
      fetchAdminDetails();
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <>
      {!loading ? (
        <div className="w-full p-2">
          <div className="flex justify-between">
            <h1 className="p-2">{adminDetails.name} </h1>
            {!deleteAccountFlag && (
              <>
                <button
                  className="border border-red-600 p-1"
                  onClick={() => setDeleteAccountFlag(true)}
                >
                  Delete Account
                </button>
              </>
            )}
          </div>
          <div>
            {!adminDetails ? (
              "An error occured while fetching your account details! Sorry for the inconvenience!"
            ) : (
              <>
                <table className="w-full border border-red-300 mt-2">
                  <thead>
                    <tr>
                      <th>Account ID</th>
                      <th>Email</th>
                      <th>Phone No</th>
                      <th>Gender</th>
                      <th>Address</th>
                      <th>
                        {!adminAccountEdit ? (
                          <button
                            className="border border-red-600 bg-blue-300 w-full"
                            onClick={() => setAdminAccountEdit(true)}
                          >
                            Edit
                          </button>
                        ) : (
                          <>
                            <button
                              className="border border-red-600 bg-blue-300 w-full"
                              onClick={() => {
                                setAdminAccountEdit(false);
                              }}
                            >
                              Close
                            </button>
                          </>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <td>{adminDetails._id}</td>
                    <td>{adminDetails.email}</td>
                    <td>{adminDetails.phoneNo}</td>
                    <td>{adminDetails.gender}</td>
                    <td>{adminDetails.address}</td>
                  </tbody>
                </table>
              </>
            )}
          </div>
          <div></div>
        </div>
      ) : (
        <>Loading...</>
      )}
      {deleteAccountFlag && (
        <>
          <div className="w-100 flex flex-col items-center mt-5">
            <h1>Are you sure you want to delete your account?</h1>
            <div className="flex gap-2">
              <button
                className="border border-red-300 p-1"
                onClick={deleteAccount}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
              <button
                className="border border-red-300 p-1"
                onClick={() => setDeleteAccountFlag(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {adminAccountEdit && (
        <div className="mb-4 w-full p-2 flex justify-center mt-5">
          <div className="w-[50%]">
            <form onSubmit={saveNewAdminDetails}>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  htmlFor="phoneNo"
                >
                  Phone No
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
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="address"
                  >
                    Phone No
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
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="border border-red-300 p-1">
                  {updateLoading ? "saving..." : "save"}
                </button>
                <button
                  className="border border-red-300 p1"
                  onClick={clearAllInputFields}
                >
                  Clear all
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
