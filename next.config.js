const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("./src/config").baseURL;

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
