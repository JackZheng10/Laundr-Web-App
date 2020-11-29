import axios from "axios";

const axiosInstance = axios.create;

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response.data);
    return response;
  },
  (error) => {
    console.log("Interceptor Response Error" + error);
  }
);

export default axiosInstance;
