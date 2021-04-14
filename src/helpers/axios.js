import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("../config").baseURL;

export default axios.create({
  baseURL: baseURL,
});
