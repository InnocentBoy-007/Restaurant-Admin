import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function PersonalDetails() {
  const [adminDetails, setAdminDetails] = useState({});
  const [adminAccountEdit, setAdminAccountEdit] = useState(false);

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/admin/details`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
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
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    <div className="w-full h-screen p-2">
      <div className="flex justify-between">
        <h1>{adminDetails.name}</h1>
        <button className="border border-red-600 p-1">Delete Account</button>
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
                  <th>Name</th>
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
                          onClick={() => setAdminAccountEdit(false)}
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
                <td>
                  {adminDetails.email}
                  {adminAccountEdit && (
                    <button className="border border-red-300 bg-blue-200 ml-1">
                      Edit
                    </button>
                  )}
                </td>
                <td>
                  {adminDetails.name}
                  {adminAccountEdit && (
                    <button className="border border-red-300 bg-blue-200 ml-1">
                      Edit
                    </button>
                  )}
                </td>
                <td>
                  {adminDetails.phoneNo}
                  {adminAccountEdit && (
                    <button className="border border-red-300 bg-blue-200 ml-1">
                      Edit
                    </button>
                  )}
                </td>
                <td>
                  {adminDetails.gender}
                  {adminAccountEdit && (
                    <button className="border border-red-300 bg-blue-200 ml-1">
                      Edit
                    </button>
                  )}
                </td>
                <td>
                  {adminDetails.address}
                  {adminAccountEdit && (
                    <button className="border border-red-300 bg-blue-200 ml-1">
                      Edit
                    </button>
                  )}
                </td>
              </tbody>
            </table>
          </>
        )}
      </div>
      <div></div>
    </div>
  );
}
