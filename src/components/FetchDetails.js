import axios from "axios"

class FetchDetails {
    async FetchAdminDetails(token) {
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/user-details`
        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            return { success: true, adminDetails: response.data.adminDetails };
        } catch (error) {
            console.error(error);
            if (error.response) {
                console.log(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                console.log("An unexpected error occured while trying to fetch admin details!");
            }
        }
    }

    // add later
    async FetchProductDetails() {
        const URL = `${import.meta.env.VITE_BACKEND_API2}/product/details`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json" }, withCredentials: true });

            return { success: true, productDetails: response.data.products };
        } catch (error) {
            console.error(error);
            if (error.response) {
                return { errorMessage: error.response.data.message };
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                console.log("An unexpected error occured while trying to fetch product details!");
            }
        }
    }

    async FetchOrderDetails() {

    }
}


const fetchDetails = new FetchDetails();
export default fetchDetails;
