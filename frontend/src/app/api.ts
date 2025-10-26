import axios from "axios";

import { getAuth } from "firebase/auth";

export const api = axios.create({
    baseURL: import.meta.env.PROD 
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:3000"
});

// Add request interceptor to include token
api.interceptors.request.use(async (config) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken(true); // Force refresh token
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request:', token);
        } else {
            console.log('No user logged in');
        }
    } catch (error) {
        console.error('Error getting token:', error);
    }
    return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });
        return Promise.reject(error);
    }
);
