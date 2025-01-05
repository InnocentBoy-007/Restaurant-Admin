import axios from "axios";
import Cookies from "js-cookie";

class ForgotPassword {
    async requestOTP(data) { // get an OTP using email
        if (!data || typeof data !== 'object') return alert("Invalid data or data is not an object!");
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/password/forgot-password/verify/email`

        try {
            const response = await axios.post(URL, data, { headers: { "Content-Type": "application/json" } });
            const { token, refreshToken, message } = response.data;
            alert(message);

            Cookies.set("adminToken", token);
            Cookies.set("adminRefreshToken", refreshToken);

            return true;
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again!");
            } else {
                alert("An unexpected error occured while trying to request an OTP!");
            }

            return false;
        }
    }

    async confirmOTP(data, token) {
        if (!data || typeof data !== 'object') return alert("Invalid data or data is not an object!");
        if (!token || typeof token !== 'string') return alert("Invalid token or token is not a string!");
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/password/forgot-password/verify/otp`;

        try {
            const response = await axios.post(URL, data, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);

            return true;
        } catch (error) {
            console.error(error);
            if (error.response) alert(error.response.data.message);

            return false;
        }
    }

    async changePassword(data, token) {
        if (!data || typeof data !== 'object') return alert("Invalid data or data is not an object!");
        if (!token || typeof token !== 'string') return alert("Invalid token or token is not a string!");
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/password/forgot-password/change-password`;

        try {
            const response = await axios.patch(URL, data, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);

            return true;
        } catch (error) {
            console.error(error);
            if (error.response) alert(error.response.data.message);

            return false;
        }
    }
}

const forgotPassword = new ForgotPassword();
export default forgotPassword;
