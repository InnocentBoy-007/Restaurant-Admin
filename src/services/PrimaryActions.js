import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("adminToken");

class PrimaryActions {
    async logout() {
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

export default {
    logout: primaryActions.logout,
}
