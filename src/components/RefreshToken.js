import axios from "axios"

export const RefreshToken = async (refreshToken, adminId) => {
    if (!refreshToken || typeof refreshToken !== 'string') {
        return alert("Refresh token is either invalid or is not a string!");
    }
    const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/token/refresh-token/${adminId}`

    try {
        const response = await axios.post(URL, {}, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${refreshToken}` }, withCredentials: true });
        const { token } = response.data;

        return token;
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.log(error.response.data.message);
        } else if (error.request) {
            alert("Network error! Please try again later!");
        } else {
            alert("An unexpected error occured while trying to fetch new token!");
        }
    }
}
