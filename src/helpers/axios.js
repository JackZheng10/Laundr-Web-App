import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("../config").baseURL;
const version = process.env.NEXT_PUBLIC_VERSION || require("../config").version;

const axiosClient = axios.create({
  baseURL: baseURL,
});

axiosClient.defaults.withCredentials = true;

axiosClient.interceptors.request.use(
  (req) => {
    req.params = { ...req.params, version: version };

    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axiosClient;
