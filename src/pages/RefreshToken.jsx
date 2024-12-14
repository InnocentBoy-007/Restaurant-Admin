import axios from "axios";

// import { useNavigate } from "react-router-dom";
// Define the refreshAccessToken function
export const refreshAccessToken = async (token, adminId, url) => {
  console.log("You clicked the function");
  try {
    const response = await axios.post(
      `${url}/${adminId}`,
      {}, // blank body
      {
        headers: {
          Authorization: `Bearer ${token}`, // this 'adminRefreshToken' contains the adminId
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const output = response.data.token;
    const message = response.data.message;
    console.log("New token --->", response.data.token);
    return { output, message };
    // Set the new tokens in cookies
    // Cookies.set("adminToken", response.data.token);
    // Cookies.set("adminRefreshToken", response.data.refreshToken);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.log(error.response.data.message);
    } else if (error.response.data.message == "Invalid token! - backend") {
      console.error("Invalid token!");
    } else if (error.response.data.message === "Token expired! - backend") {
      console.error("Token expired!");
    }
  }
};

// Export the function
export default refreshAccessToken;
