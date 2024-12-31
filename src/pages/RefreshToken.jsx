import axios from "axios";
import Cookies from "js-cookie";

export const refreshAccessToken = async (refreshToken, adminId) => {
  console.log("You clicked the function"); // function check
  const URL = `${import.meta.env.VITE_BACKEND_API}/token/${adminId}`;
  try {
    const response = await axios.post(
      `${URL}`,
      {}, // blank body
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`, // this 'adminRefreshToken' contains the adminId
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const output = response.data.token;
    const message = response.data.message;
    console.log("New token --->", response.data.token);
    Cookies.set("adminToken", response.data.token);
    Cookies.set("adminRefreshToken", response.data.refreshToken);
    return { output, message };
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.log(error.response.data.message);
    } else if (error.response.data.message === "Invalid token! - backend") {
      console.error("Invalid token!");
    } else if (error.response.data.message === "Token expired! - backend") {
      console.error("Token expired!");
    }
  }
};

// Export the function
export default refreshAccessToken;
