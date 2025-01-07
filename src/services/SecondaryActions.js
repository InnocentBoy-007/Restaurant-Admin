import axios from "axios";

class SecondaryActions {
    async deleteAccount(data, token) {
        if (!data || typeof data !== 'object') return 'Data is undefined or null or is not an object!';
        if (!token || typeof token !== 'string') return 'Token is undefined or null or is not a string!'
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/details/delete`;

        try {
            const response = await axios.post(URL, data, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to delete the account!");
            }

        }
    }

    async updateAccount(data, token) {
        if (!data || typeof data !== 'object') return 'Data is undefined or null or is not an object!';
        if (!token || typeof token !== 'string') return 'Token is undefined or null or is not a string!';

        const URL = `${import.meta.env.VITE_BACKEND_API}/account/details/update`;

        try {
            const response = await axios.patch(URL, data, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to update the account!");
            }
        }
    }
}


const secondaryActions = new SecondaryActions();

export default secondaryActions;
