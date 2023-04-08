const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use('/api', createProxyMiddleware({
        target: 'https://crm.ilist.gr',
        changeOrigin: true,
        headers: {
            'Authorization': 'd33db979-e6cf-4661-9e65-94fff50ecca6'
        }
    }));
};
