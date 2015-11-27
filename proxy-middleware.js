var http = require('http');

 /**
  * Construct an http request
  */
 function makeProxyRequest(opts, res) {
     var proxy = http.request(opts, function(proxyRes) {
         res.writeHead(proxyRes.statusCode, proxyRes.headers);
         //pipe proxy response to the server's response
         proxyRes.pipe(res, { end: true });
     });

     proxy.on('error', function(err) {
         console.error(err);
         proxy.abort();
         res.writeHead(500);
         res.write(JSON.stringify(err));
         res.emit('end');
         res.end();
     });

     return proxy;
 }


module.exports = function makeProxyMiddleware(config) {
    return function proxyMiddleware(req, res, next) {
        config.path = req.url;
        config.method = req.method;

        var proxy = makeProxyRequest(config, res),
            body = '';
        if(req.method.toLowerCase() === 'post') {
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                proxy.write(body);
                proxy.end();
            });
        }
        else {
            proxy.end(); //this sends the proxy request
        }
    };
};
