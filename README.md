# Bogus API

A wrapper around the great (json-server)[https://github.com/typicode/json-server]. It allows you to specify multiple "database" or REST resources. Pass in a directory of Javascript files to be required, and they become your REST endpoints.

### Install
```
npm install bogus-api
```

### Usage
```javascript
require('bogus-api').start({
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

Or could look like:
```javascript
module.exports = [
    { "id": 1, "title": "json-server", "author": "typicode" },
    { "id": 2, "title": "test", "author": "ccnokes" }
];
```
So you get a little more flexibility than with plain `json-server`.


You can add or override routes using the Express API like so:
```javascript
var bogusAPI = require('bogus-api');
bogusAPI.server.get('/posts', function(req, res) {
    res.status(500).send({ message: 'Some error.' });
});
```
