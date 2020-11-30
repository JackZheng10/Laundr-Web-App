import axios from "axios";

const axiosInstance = axios.create;

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response.data);
    if (response.data.redirect) {
    }
    return response;
  },
  (error) => {
    console.log("Interceptor Response Error" + error);
  }
);

export default axiosInstance;
