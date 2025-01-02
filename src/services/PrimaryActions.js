import axios from "axios";
import Cookies from "js-cookie";

class PrimaryActions {
    async getToken() {
        const token = Cookies.get("adminToken");
        if (!token) throw new Error("Token is not found!");
        return token;
    }

    async signIn(body) {
        if (!body) throw new Error("Body is undefined or null!");
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/signin`

        try {
            const response = await axios.post(URL, body, { headers: { 'Content-Type': 'application/json' } });
            Cookies.set("adminToken", response.data.token);
            Cookies.set("adminRefreshToken", response.data.refreshToken);
            alert(response.data.message);
            // return;
            // it'll just explicitly return 'undefined'
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            }
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

    async logout() {
        const token = await this.getToken();
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
