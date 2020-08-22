console.log("ENVIRONMENT VARIABLES: ", process.env);
const baseURL = process.env.BASE_URL || require("./config").baseURL;

export default baseURL;
