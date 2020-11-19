module.exports = {
  BASE_URL:
    // https://mock.yonyoucloud.com/mock/3831
    // https://uastest.yyuap.com
    // http://47.104.104.45:8090
    process.env.NODE_ENV == "production" ? "" : "http://47.104.104.45:8090",
};
