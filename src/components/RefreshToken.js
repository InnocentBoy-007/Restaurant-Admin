import axios from "axios";
import Cookies from "js-cookie";

export const RefreshToken = async (refreshToken, adminId) => {
    if (!refreshToken || typeof refreshToken !== 'string') return console.log("Token is either invalid nor string or is not found!");
    const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/token/refresh-token/${adminId}`;

    Cookies.remove("adminToken"); // remove the old token first

    try {
        const response = await axios.post(URL, {}, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${refreshToken}` }, withCredentials: true });
        const { token } = response.data;

        return { success: true, token };
    } catch (error) {
        console.error(error);
        if (error.response) {
            alert(error.response.data.message);
        } else if (error.request) {
            alert("Network error! Please try again later!");
        } else {
            alert("An unexpected error occured while trying to generate a new token!");
        }
    }
}
