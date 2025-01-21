import axios from "axios";

class ProductController {
    async addProduct(body, token) {
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/products/add_product`
        try {
            const response = await axios.post(URL, body, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to add the product!");
            }
        }
    }

    async updateProduct(productId, data, token) {
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/products/update_product/${productId}`;
        try {
            const response = await axios.patch(URL, data, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to update the product!");
            }
        }

        return { success: true };
    }

    async deleteProduct(productId, token) {
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/products/delete_product/${productId}`;
        try {
            const response = await axios.delete(URL, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to delete the product!");
            }
        }
    }
}

const productController = new ProductController()
export default productController;
