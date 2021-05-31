const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("./src/config").baseURL;

//in case you forget to use the axios helper and inadvertently use api routes
//next export does not apply rewrites
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${baseURL}/api/:path*`,
      },
    ];
  },
};
