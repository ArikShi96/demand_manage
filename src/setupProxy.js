const proxy = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    proxy("/market", {
      target: "http://47.104.104.45:8090",
      // secure: false,
      changeOrigin: true,
      // pathRewrite: {
      //     "^/api": ""
      // },
      cookieDomainRewrite: "http://localhost:3002",
    })
  );
};
