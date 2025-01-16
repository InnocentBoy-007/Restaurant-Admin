// test successfull

import axios from "axios";

class PrimaryActions {
    async signIn(data) {
        if (!data || typeof data !== 'object') throw new Error("Body is undefined or null!");
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/signin`

        try {
            const response = await axios.post(URL, data, { headers: { 'Content-Type': 'application/json' } });
            const { token, refreshToken, message } = response.data;
            if (!token || !refreshToken) throw new Error("Invalid token response!");

            alert(message);

            return { token, refreshToken, success: true };
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again!");
            } else {
                alert("An unexpected error occured while trying to signIn!");
            }
        }
    }

    async signUp(data) {
        if (!data || typeof data !== 'object') throw new Error("Body is undefined or null!");
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/signup`;

        try {
            const response = await axios.post(URL, data, { headers: { "Content-Type": 'application/json' } });
            const { token, refreshToken, message } = response.data;

            alert(message);

            return { token, refreshToken, success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to signup!");
            }
        }
    }

    async logout(token) {
        const URL = `${import.meta.env.VITE_BACKEND_API}/account/logout`

        try {
            const response = await axios.delete(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            const { message } = response.data;

            return { message };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to logout!");
            }
        }
    }
}

const primaryActions = new PrimaryActions();

export default primaryActions;
