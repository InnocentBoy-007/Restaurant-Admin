import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function ProductPage() {
  const [orderDetails, setOrderDetails] = useState([]);
  const token = Cookies.get("adminToken");

  const fetchAdminDetails = async () => {
    if (!token) {
      console.log("No token found!");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/fetchOrders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setOrderDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (e, orderId) => {
    e.preventDefault();
    if (!token) {
      console.log("No token found!");
      return;
    }
    const admin = jwtDecode(token);
    const adminName = admin.adminName;
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_API
        }/acceptOrder/${orderId}/${adminName}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      fetchAdminDetails();
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [token]); // Re-fetches data when the token changes

  return (
    <>
      <div className="text-center">
        <h1 className="mt-2">Admin Panel</h1>
        <div className="w-full mt-4">
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
                  {" "}
                  {/* Use a unique identifier for the key */}
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.orderEmail}</td>
                  <td>{order.orderName}</td>
                  <td>{order.orderPhoneNo}</td>
                  <td>{order.orderProductName}</td>
                  <td>{order.orderQuantity}</td>
                  <td>{order.orderAddress}</td>
                  <td>{order.productPrice}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.orderTime}</td>
                  <td>
                    {order.acceptedByAdmin === "pending" ? (
                      <>
                        {order.acceptedByAdmin}
                        <button
                          onClick={(e) => acceptOrder(e, order._id)}
                          style={{ border: "2px solid blue" }}
                        >
                          {loading ? 'accepting...':'accept'}
                        </button>
                        <button style={{ border: "2px solid red" }}>
                          reject
                        </button>
                      </>
                    ) : (
                      <span>{order.acceptedByAdmin}</span>
                    )}
                  </td>
                  <td>{order.orderDispatchedTime}</td>
                  <td>{order.receivedByClient}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
