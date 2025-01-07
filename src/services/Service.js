import axios from "axios";

class Services {
    async acceptOrder(orderId, token) {
        if (!orderId) return alert("Invalid orderId!");
        if (!token || typeof token !== 'string') return alert("Invalid token or token is not a string!");

        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/orders/accept_order/${orderId}`;

        try {
            const response = await axios.post(URL, {}, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to accept the order!");
            }
        }
    }

    async rejectOrder(orderId, token) {
        if (!orderId) return alert("Invalid orderId!");
        if (!token || typeof token !== 'string') return alert("Invalid token or token is not a string!");

        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/orders/reject_order/${orderId}`;

        try {
            const response = await axios.delete(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to reject the order!");
            }
        }
    }
}

const services = new Services();
export default services;
