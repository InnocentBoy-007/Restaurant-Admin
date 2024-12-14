import React from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import refreshAccessToken from "./RefreshToken";

export default function TestingPage() {
  const token = Cookies.get("adminRefreshToken");
  const decodedToken = jwtDecode(token);
  const adminId = decodedToken.adminId;
  const url = `${import.meta.env.VITE_BACKEND_API}/token`;

  const handleRefreshToken = async () => {
    try {
      const { output, message } = await refreshAccessToken(token, adminId, url);
      console.log("Output:", output);
      console.log("Message:", message);
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  return (
    <div>
      <h1>Hi</h1>
      <button onClick={handleRefreshToken}>Click here</button>
    </div>
  );
}
