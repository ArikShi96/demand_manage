var myapi = {
    BASE_URL: (
      //https://mock.yonyoucloud.com/mock/3831
      //https://uastest.yyuap.com
        process.env.NODE_ENV == 'production' ? '' : 'https://uastest.yyuap.com')
}
console.log(process.env.NODE_ENV)

module.exports = myapi;
