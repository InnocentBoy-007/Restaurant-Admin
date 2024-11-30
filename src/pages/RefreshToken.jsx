import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Define the refreshAccessToken function
export const refreshAccessToken = async (navigate) => {
  //   const token = Cookies.get("adminToken");
  //   const accountId = jwtDecode(token).adminId;
  console.log(
    "Token to send to backend, backup token--->",
    Cookies.get("adminRefreshToken")
  );

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/admin/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminRefreshToken")}`, // this 'adminRefreshToken' contains the adminId
          "Content-Type": "application/json",
        },
      }
    );

    // Set the new tokens in cookies
    Cookies.set("adminToken", response.data.token);
    Cookies.set("adminRefreshToken", response.data.refreshToken);

    return response.data.token; // Return the new token if needed
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Handle error (e.g., redirect to login if refresh fails)
    // Optionally, clear cookies and navigate to login
    Cookies.remove("adminToken");
    Cookies.remove("adminRefreshToken");
    navigate("/");
  }
};

// Export the function
export default refreshAccessToken;
