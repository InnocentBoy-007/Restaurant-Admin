import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import services from "../services/Service";
import { isTokenExpired } from "../components/IsTokenExpired";
import { RefreshToken } from "../components/RefreshToken";

export default function OrderPage() {
  const navigate = useNavigate();

  let token = Cookies.get("adminToken");
  const refreshToken = Cookies.get("adminRefreshToken");

  const decodedToken = jwtDecode(refreshToken);
  const adminId = decodedToken.adminId;

  const [orderDetails, setOrderDetails] = useState([]);

  const [adminName, setAdminName] = useState("");

  // reduce the loadings to only a single loading
  const [loading, setLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutFlag, setLogoutFlag] = useState(false);

  const fetchAdminDetails = async () => {
    if (!token || isTokenExpired(token)) {
      token = await RefreshToken(refreshToken, adminId);
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/v1/admin/user-details`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setAdminName(response.data.adminDetails.name);
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  };

  // this function inclues the mechanism for retrieving a new token using refresh token
  const fetchOrderDetails = async () => {
    setLoading(true);
    if (!token || isTokenExpired(token)) {
      token = await RefreshToken(refreshToken, adminId);
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/v1/admin/orders/fetch_orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        console.log(error.response.data.message);
      }
    }
  };

  // function to accept order
  const acceptOrder = async (e, orderId) => {
    e.preventDefault();
    setAcceptLoading(true);

    try {
      const response = await services.acceptOrder(orderId, token);
      if (response.success) {
        fetchOrderDetails();
        setAcceptLoading(false);
      }
    } catch (error) {
      setAcceptLoading(false);
    }
  };

  // function to reject order
  const rejectOrder = async (e, orderId) => {
    e.preventDefault();
    setRejectLoading(true);

    try {
      const response = await services.rejectOrder(orderId, token);
      if (response.success) {
        fetchOrderDetails();
        setRejectLoading(false);
      }
    } catch (error) {
      setRejectLoading(false);
    }
  };

  const logOut = async (e) => {
    e.preventDefault();
    setLogoutLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/account/logout`,
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
        console.log(error.response.data.message);
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
                          {order.status === "pending" ? (
                            <>
                              {order.status}
                              <button
                                onClick={(e) => acceptOrder(e, order._id)}
                                style={{ border: "2px solid blue" }}
                              >
                                {acceptLoading ? "accepting..." : "accept"}
                              </button>
                              <button
                                onClick={(e) => rejectOrder(e, order._id)}
                                style={{ border: "2px solid red" }}
                              >
                                {rejectLoading ? "rejecting..." : "reject"}
                              </button>
                            </>
                          ) : (
                            <span>{order.status}</span>
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
