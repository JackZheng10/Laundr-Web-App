const baseURL =
  process.env.BASE_URL ||
  require("./config").baseURL ||
  "http://localhost:5000/api";

export default baseURL;
