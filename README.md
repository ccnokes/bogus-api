# Bogus API

A wrapper around the great [json-server](https://github.com/typicode/json-server). It allows you to specify multiple REST resources. Pass in a directory of Javascript files to be required, and they become your REST endpoints.

### Install
```
npm install bogus-api
```

### Usage
```javascript
require('bogus-api').create().start({
    resourceDir: './my-resources',
    resourceUriPrefix: '/api/v1',
});
```

Each JS file in the `my-resources` directory could look like:
```javascript
var users = [];
// Create 10 users
for (var i = 0; i < 10; i++) {
    users.push({ id: i, name: 'user' + i });
}
module.exports = users;
```

Or it could look like:
```javascript
module.exports = [
    { "id": 1, "title": "json-server", "author": "typicode" },
    { "id": 2, "title": "test", "author": "ccnokes" }
];
```
So you get a little more flexibility than with plain `json-server`.


You can add or override routes using the Express API like so:
```javascript
bogusAPI = require('bogus-api');
var bogusServer = bogusAPI.create({
    // These routes will get mounted before the resources are, allowing you to "short-circuit" them
    // This is useful for testing how the UI reacts to error states from an API
    priorityRoutes: function(server) {
        // the server arg is an instance of an Express server
        server.get('/someRoute', function(req, res) {
            res.status(500).send({ message: 'Some error.' });
        });
    }
}).start();
```

## Options

| Option            | Description  |
| ----------------- |--------------|
| port              | Port the app runs on. 7001 by default. |
| host              | 0.0.0.0 by default. |
| resourceUriPrefix | Prefixes all resources with a URI. |
| resourceDir       | Directory containing your resources. Default to sample-resources. |
| proxy             | Object containing the host and port of the URL to proxy to. No default. |
| staticDir         | Path to static directory to serve. |
| staticUri         | URI to serve static directory through.  |
