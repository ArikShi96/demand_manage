var express = require('express');
const proxy = require('http-proxy-middleware');
var app = express();
module.exports = function (app) {
    app.use(proxy('/market', {
        target: 'https://uastest.yyuap.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            "^/market": ""
        },
        cookieDomainRewrite: "http://localhost:3000"
    }));
};
