import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500/api",
  withCredentials: true, // send cookies to the server
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
