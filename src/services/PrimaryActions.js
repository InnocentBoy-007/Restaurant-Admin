import axios from "axios";
import Cookies from "js-cookie";

class PrimaryActions {
    async signIn(body) {
        if (!body) throw new Error("Body is undefined or null!");
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/signin`

        try {
            const response = await axios.post(URL, body, { headers: { 'Content-Type': 'application/json' } });
            const { token, refreshToken, message } = response.data;
            if (!token || !refreshToken) throw new Error("Invalid token response!");

            Cookies.set("adminToken", token);
            Cookies.set("adminRefreshToken", refreshToken);
            alert(message);

            return true;
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again!");
            } else {
                alert("An unexpected error occured while trying to signIn!");
            }

            return false;
        }
    }

    async signUp(body) {
        if (!body) throw new Error("Body is undefined or null!");
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/signup`;

        try {
            const response = await axios.post(URL, body, { headers: { "Content-Type": 'application/json' } });
            alert(response.data.message);
            Cookies.set("adminToken", response.data.token);
            Cookies.set("adminRefreshToken", response.data.refreshToken);
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);

                // if anything goes wrong, remove the tokens
                Cookies.remove("adminToken");
                Cookies.remove("adminRefreshToken");
            }
        }
    }

    async logout(token) {
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/logout`

        try {
            const response = await axios.delete(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            Cookies.remove("adminToken");
            Cookies.remove("adminRefreshToken");
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            }
        }
    }
}

const primaryActions = new PrimaryActions();

export default primaryActions;
