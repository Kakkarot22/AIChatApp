import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_URL);
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosInstance;
