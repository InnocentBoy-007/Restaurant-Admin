import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("adminToken");
class ProductController {
    async addProduct(body) {
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/products/add_product`
        try {
            const response = await axios.post(URL, body, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);
            return;
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            }
        }
    }

    async updateProduct(productId, body) {
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/products/update_product/${productId}`;
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

    async deletePoduct(productId) {
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/products/delete_product/${productId}`;
        try {
            const response = await axios.delete(URL, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);
            return;
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            }
        }
    }
}

const productController = new ProductController()

export default {
    addProduct: productController.addProduct,
    updateProduct: productController.updateProduct,
    deleteProduct: productController.deletePoduct,
}
