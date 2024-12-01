import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import refreshAccessToken from "./RefreshToken";

export default function ProductPage() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState([]);
  const token = Cookies.get("adminToken"); // this is the primary token
  const decodedToken = jwtDecode(token);
  const adminId = decodedToken.adminId;
  //   const token2 = Cookies.get("signInAdminToken");
  //   const decodedToken = jwtDecode(token);
  //   const adminName = decodedToken.adminName;

  const [adminName, setAdminName] = useState("");

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/admin/adminDetails`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setAdminName(response.data.adminDetails);
      console.log("Admin details--->", response.data.adminDetails);
    } catch (error) {
      console.log(error);
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const fetchOrderDetails = async () => {
    // console.log("token-->", token);

    if (!token) {
      //   console.log("No token found!");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/admin/orders/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setOrderDetails(response.data.orders);
      // console.log(response.data);
    } catch (error) {
      if (error.response) {
        const newToken = await refreshAccessToken(navigate);
        if (newToken) {
          return fetchOrderDetails();
        } else {
          console.log(error);
        }
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
        }/admin/orders/accept/${orderId}/${productId}`,
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
        `${
          import.meta.env.VITE_BACKEND_API
        }/admin/orders/reject/${orderId}/${adminName}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setRejectLoading(false);
      fetchOrderDetails();
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setRejectLoading(false);
    }
  };

  const logOut = async (e) => {
    e.preventDefault();
    setLogoutLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/admin/logout`,
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
    fetchOrderDetails();
  }, [token]); // Re-fetches data when the token changes

  return (
    <>
      <div className="text-center">
        <h1 className="mt-2">Admin Panel</h1>
        {adminName ? <h1>Welcome {adminName} to the admin panel</h1> : <></>}
        <div>
          <button className="border border-red-600 p-1" onClick={logOut}>
            {logoutLoading ? "logging out..." : "log out"}
          </button>
        </div>
        <div className="w-full mt-4">
          {orderDetails.length === 0 ? (
            <h1>There are no order details</h1>
          ) : (
            <table className="w-full">
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
        </div>
      </div>
    </>
  );
}
