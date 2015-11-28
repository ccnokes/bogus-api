var request = require('supertest'),
    bogusAPI = require('../src/server'),
    test = require('tape'),
    express = require('express');

const PROXY_PORT = 7100;


// start test proxy server
var testProxy = express();
testProxy.get('/users', function(req, res){
    res.status(200).send({ message: 'this should not work' });
});
testProxy.get('/pokemon', function(req, res){
    res.status(200).send({ message: 'pika pika' });
});
testProxy.listen(PROXY_PORT)


// start bogusAPI
var bogusServer = bogusAPI.create({
    staticDir: '.',
    staticUri: '/static',
    proxy: {
        host: 'localhost',
        port: PROXY_PORT
    }
}).start();


// start the tests
test('bogusServer sample resources should be GET-able ', t => {
    t.plan(1);

    var postsResource = require('../src/sample-resources/posts');

    request('localhost:7000')
        .get('/posts')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                t.fail('Content-Type or HTTP status is incorrect');
            }
            t.deepEqual(res.body, postsResource, 'response is equal to resource');
            t.end();
        });
});

test('bogusServer should work with a fallback proxy', t => {
    t.plan(1);

    request('localhost:7000')
        .get('/pokemon')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                t.fail('Content-Type or HTTP status is incorrect');
            }
            t.deepEqual(res.body, { message: 'pika pika' }, 'response is equal to resource');
            t.end();
        });
});

test('bogusServer should serve it\'s resource first, even if it exists in the proxy too', t => {
    t.plan(1);

    var usersResource = require('../src/sample-resources/users');

    request('localhost:7000')
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                t.fail('Content-Type or HTTP status is incorrect');
            }
            t.deepEqual(res.body, usersResource, 'response is equal to resource');
            t.end();
        });
});

test('bogusServer should 404 if no resource exists', t => {
    t.plan(1);

    request('localhost:7000')
        .get('/noexist')
        .expect(404)
        .end((err, res) => {
            if (err) {
                t.fail('HTTP status is incorrect');
            }
            else {
                t.pass('404-ed as expected');
            }
            t.end();
        });
});

test('bogusServer should serve static content index', t => {
    t.plan(1);

    request('localhost:7000')
        .get('/static')
        .expect(200)
        .expect('Content-Type', /html/)
        .end((err, res) => {
            if (err) {
                t.fail('HTTP status or Content-Type is incorrect');
            }
            else {
                t.pass('serving static content as expected');
            }
            t.end();
        });
});

test('bogusServer should serve static content', t => {
    t.plan(1);

    request('localhost:7000')
        .get('/static/package.json')
        .expect(200)
        .expect('Content-Type', /json/) //json because that's the file type we're requesting
        .end((err, res) => {
            if (err) {
                t.fail('HTTP status or Content-Type is incorrect');
            }
            t.deepEqual(res.body, require('../package.json'), 'serving static content as expected');
            t.end();
        });
});
