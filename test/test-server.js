
/**
 * TODO add tests here with superagent or something
 */

var bogusAPI = require('../index');

bogusAPI.create({
    proxy: {
        host: 'localhost',
        port: 7100
    }
}).start();
