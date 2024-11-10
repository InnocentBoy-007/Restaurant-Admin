import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function ProductPage() {
  const token = Cookies.get("adminToken");
  console.log(token);

  const fetchAdminDetails = async () => {
    if (!token) {
      console.log("No token found!");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/protectedRoute`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    <div>
      <h1>{token}</h1>
    </div>
  );
}
