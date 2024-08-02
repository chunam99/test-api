import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ca34-2001-ee0-5005-97e0-c9ae-7097-d24b-dc50.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
