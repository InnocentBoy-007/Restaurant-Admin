import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error("Invalid token:", error);
        return true;
    }
};
