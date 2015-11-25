
var chalk = require('chalk'),
    express = require('express'),
    jsonServer = require('json-server'),
    serveIndex = require('serve-index'),
    requireDirectory = require('require-directory'),
    server = jsonServer.create(); // express server instance


function merge(src, target) {
    return Object.assign({}, src, target);
}

function print(color, val) {
    console.log(chalk[color].bold(val));
}

function printRoutes(resources, opts) {
    print('gray', 'Routes:');
    Object.keys(resources)
        .map(item => opts.resourceBaseUrl + item)
        .forEach(route => print('gray', route));
}


exports.server = server;

exports.start = function(options) {
    //set up the options
    var opts = merge({
        port: 7000,
        host: '0.0.0.0',
        resourceUriPrefix: '',
        resourceDir: './sample-resources'
    }, options);
    opts.url = `http://${opts.host}:${opts.port}`;
    opts.resourceBaseUrl = `http://${opts.host}:${opts.port}/${opts.resourceUriPrefix}`;

    var isServingStatic = !!(opts.staticDir && opts.staticUri),
        resources = requireDirectory(module, opts.resourceDir);

    // serve static files if passed in
    if(isServingStatic) {
        server.use(opts.staticUri, serveIndex(opts.staticDir));
        server.use(opts.staticUri, express.static(opts.staticDir));
    }

    // set default middlewares (logger, static, cors and no-cache)
    server.use(jsonServer.defaults());

    // mount all resources as routes
    server.use(opts.resourceUriPrefix, jsonServer.router(resources));

    // start the server
    server.listen(opts.port, opts.host, () => {
        print('blue', '--------------------------------------------------------------');
        print('blue', `Mock API server started at ${opts.url}`);
        printRoutes(resources, opts);
        if(isServingStatic) {
            print('blue', 'Serving static content from ' + opts.staticUri);
        }
        print('blue', '--------------------------------------------------------------');
    });

    // return public API
    return {
        jsonServer: jsonServer,
        get resources() { return resources; }
    };
};
