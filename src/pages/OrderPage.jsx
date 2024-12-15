import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import refreshAccessToken from "./RefreshToken";
import { jwtDecode } from "jwt-decode";

export default function OrderPage() {
  const navigate = useNavigate();

  const token = Cookies.get("adminToken");
  const decodedToken = jwtDecode(token);

  if (!token) {
    navigate("/");
  }
  const [orderDetails, setOrderDetails] = useState([]);
  // this is the primary token

  const [adminName, setAdminName] = useState("");

  const [loading, setLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutFlag, setLogoutFlag] = useState(false);

  const refreshToken = Cookies.get("adminRefreshToken");
  const adminId = decodedToken.adminId;
  const refreshToken_URL = `${import.meta.env.VITE_BACKEND_API}/token`;

  // this function includes the mechanism for retrieving a new token using refresh token
  const fetchAdminDetails = async () => {
    let isRefreshing = false; // Flag to prevent multiple refresh calls
    let newToken = null; // Store the new token if refreshed

    const backupFunction = async () => {
      if (!isRefreshing) {
        isRefreshing = true; // Set the flag to true
        try {
          const { output } = await refreshAccessToken(
            refreshToken,
            adminId,
            refreshToken_URL
          );
          newToken = output; // Store the new token
        } catch (error) {
          console.error("Failed to refresh token:", error);
          // Handle refresh token failure (e.g., log out user)
        } finally {
          isRefreshing = false; // Reset the flag
        }
      }
      return fetchAdminDetails(); // Retry fetching admin details
    };

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/details`,
        {
          headers: { Authorization: `Bearer ${newToken || token}` },
          withCredentials: true,
        }
      );
      setAdminName(response.data.adminDetails.name);
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.data.message === "Token expired! - backend") {
          await backupFunction(); // Call backup function if token expired
        } else {
          alert(error.response.data.message);
        }
      } else {
        await backupFunction(); // Call backup function for other errors
      }
    }
  };

  // this function inclues the mechanism for retrieving a new token using refresh token
  const fetchOrderDetails = async () => {
    setLoading(true);
    let isRefreshing = false;
    let newToken = null;

    const backupFunction = async () => {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { output } = await refreshAccessToken(
            refreshToken,
            adminId,
            refreshToken_URL
          );
          newToken = output;
        } catch (error) {
          console.error(error);
        } finally {
          isRefreshing = false; // Reset the flag
        }
      }
      return fetchOrderDetails();
    };

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token || newToken}`,
          },
          withCredentials: true,
        }
      );
      setLoading(false);
      setOrderDetails(response.data.orders);

      // console.log(response.data);
    } catch (error) {
      console.log("Error-->", error);

      if (error.response) {
        if (error.response.data.message === "Token expired! - backend") {
          await backupFunction();
        } else {
          alert(error.response.data.message);
        }
      } else {
        await backupFunction();
      }
    }
  };

  const acceptOrder = async (e, orderId, productId) => {
    e.preventDefault();
    setAcceptLoading(true);
    if (!token) {
      console.log("No token found!");
      return;
    }
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API
        }/orders/accept/${orderId}/${productId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      fetchOrderDetails();
      //   console.log(response.data.message);
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    } finally {
      setAcceptLoading(false);
    }
  };

  const rejectOrder = async (e, orderId) => {
    e.preventDefault();
    setRejectLoading(true);
    // console.log("Token--->", token); // it works

    if (!token) {
      console.log("No token found!");
      return;
    }
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/orders/reject/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      fetchOrderDetails();
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setRejectLoading(false);
    }
  };

  const logOut = async (e) => {
    e.preventDefault();
    setLogoutLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/logout`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      Cookies.remove("adminToken");
      Cookies.remove("adminRefreshToken");
      setLogoutLoading(false);
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      navigate("/");
      setLogoutLoading(false);
      if (error.response) {
        const newToken = await refreshAccessToken(); // this function sends the refresh token to fetch a new primary token
        if (newToken) {
          return logOut(e);
        } else {
          console.log(error);
        }
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
    fetchOrderDetails();
  }, [token]); // Re-fetches data when the token changes

  return (
    <>
      <div className="text-center">
        <h1 className="mt-2">Admin Panel</h1>
        {adminName ? <h1>Welcome {adminName} to the admin panel</h1> : <></>}
        <div className="flex justify-between w-full p-2">
          <button
            className="border border-blue-600 p-1"
            onClick={() => navigate("/admin/profile")}
          >
            Profile
          </button>
          <button
            className="border border-blue-600 p-1"
            onClick={() => navigate("/admin/products")}
          >
            Products
          </button>
          {!logoutFlag && (
            <button
              className="border border-red-600 p-1"
              onClick={() => setLogoutFlag(true)}
            >
              log out
            </button>
          )}
        </div>
        <div className="w-full mt-4">
          {orderDetails.length === 0 ? (
            <h1>There are no order details</h1>
          ) : (
            <>
              {loading ? (
                <h1>Fetching order details...</h1>
              ) : (
                <table className="w-full border border-red-300">
                  <thead>
                    <tr>
                      <th>Sl no.</th>
                      <th>Order ID</th>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Phone No</th>
                      <th>Product Name</th>
                      <th>Order Quantity</th>
                      <th>Address</th>
                      <th>Product Price</th>
                      <th>Total Price</th>
                      <th>Order Time</th>
                      <th>Accepted by Admin</th>
                      <th>Order Dispatched Time</th>
                      <th>Received by Client</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((order, index) => (
                      <tr key={order.id || index}>
                        {/* Use a unique identifier for the key */}
                        <td>{index + 1}</td>
                        <td>{order._id}</td>
                        <td>{order.email}</td>
                        <td>{order.clientName}</td>
                        <td>{order.phoneNo}</td>
                        <td>{order.productName}</td>
                        <td>{order.productQuantity}</td>
                        <td>{order.address}</td>
                        <td>{order.productPrice}</td>
                        <td>{order.totalPrice}</td>
                        <td>{order.orderTime}</td>
                        <td>
                          {order.acceptedByAdmin === "pending" ? (
                            <>
                              {order.acceptedByAdmin}
                              <button
                                onClick={(e) =>
                                  acceptOrder(e, order._id, order.productId)
                                }
                                style={{ border: "2px solid blue" }}
                              >
                                {acceptLoading ? "accepting..." : "accept"}
                              </button>
                              <button
                                style={{ border: "2px solid red" }}
                                onClick={(e) => rejectOrder(e, order._id)}
                              >
                                {rejectLoading ? "rejecting..." : "reject"}
                              </button>
                            </>
                          ) : (
                            <span>{order.acceptedByAdmin}</span>
                          )}
                        </td>
                        <td>{order.orderDispatchedTime}</td>
                        <td>{order.receivedByClient ? "yes" : "no"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center mt-2">
        {logoutFlag && (
          <div className="border border-red-600 text-center p-2">
            <h1>Are you sure you want to logout?</h1>
            {logoutLoading ? (
              "Logging out..."
            ) : (
              <div className="flex justify-center gap-2">
                <button
                  className="border border-red-300 p-1 bg-blue-300"
                  onClick={logOut}
                >
                  Yes
                </button>
                <button
                  onClick={() => setLogoutFlag(false)}
                  className="border border-red-300 p-1 bg-red-300"
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
