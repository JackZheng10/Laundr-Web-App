import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("../config").baseURL;
const version = process.env.VERSION || require("../config").version;

const axiosClient = axios.create({
  baseURL: baseURL,
});

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
