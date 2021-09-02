// create-react-app前端跨域的配置
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
      '/api',
      createProxyMiddleware({
          target: 'https://mobile-ms.uat.homecreditcfc.cn/mock/60fe79229850ad001dfeaa29/',
          changeOrigin: true,
        })
    );
  };