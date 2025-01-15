import { jwtDecode } from "jwt-decode";

/**
 * If the token is close to expiring and there is network latency, the token might expire before the refresh request is completed.
To handle this, you can add a buffer time (e.g., 5 minutes) to the token expiry check:
 */

export const isTokenExpired = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const bufferTime = 300; // 5 minutes in seconds
        return decodedToken.exp - bufferTime < currentTime;
    } catch (error) {
        console.error("Invalid token:", error);
        return true;
    }
};
