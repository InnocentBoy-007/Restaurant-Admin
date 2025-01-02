import axios from "axios";
import Cookies from "js-cookie";

class SecondaryActions {
    async getToken() {
        const token = Cookies.get("adminToken");
        if (!token) throw new Error("Token is not found!");
        return token;
    }

    async deleteAccount(body) {
        if (!body) return 'Body is undefined or null';

        const token = await this.getToken();
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/details/delete`;

        try {
            const response = await axios.post(URL, body, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, withCredentials: true });

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

    async updateAccount(body) {
        if (!body) return 'Body is undefined or null';

        const token = await this.getToken();
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/details/update`;

        try {
            const response = await axios.patch(URL, body, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            }
        }
    }
}


const secondaryActions = new SecondaryActions();

export default secondaryActions;
