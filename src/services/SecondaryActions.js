import axios from "axios";

class SecondaryActions {
    async DeleteAccount(data, token) {
        if (!data || typeof data !== 'object') return 'Data is undefined or null or is not an object!';
        if (!token || typeof token !== 'string') return 'Token is undefined or null or is not a string!'
        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/account/details/delete`;

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

    async UpdateAccount(data, token) {
        if (!data || typeof data !== 'object') return 'Data is undefined or null or is not an object!';
        if (!token || typeof token !== 'string') return 'Token is undefined or null or is not a string!';

        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/account/details/update`;

        try {
            const response = await axios.patch(URL, data, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);

            if (response.data.otp) {
                return { otp: true }
            }

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

    async ConfirmOTP(data, token) {
        if (!data || typeof data !== 'object') return alert("Data is undefined or null or is not an object!");
        if (!token || typeof token !== 'string') return alert("Token is undefined or null or is not a string!");

        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/account/details/confirm-otp`

        try {
            const response = await axios.post(URL, data, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to confirm the OTP!");
            }
        }
    }

    // test passed
    async ChangePassword(data, token) {
        if (!data || typeof data !== 'object') return console.log("Data is either invalid or is not an object!");
        if (data.newPassword !== data.confirmPassword) return alert("Error! The confirm password must be same as the new password!");

        const URL = `${import.meta.env.VITE_BACKEND_API}/v1/admin/password/change-password`;

        try {
            const response = await axios.patch(URL, { passwords: { currentPassword: data.currentPassword, newPassword: data.newPassword } }, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            alert(response.data.message);
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to change password!");
            }
        }
    }
}


const secondaryActions = new SecondaryActions();

export default secondaryActions;
