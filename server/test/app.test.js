// Run with: JWT_SECRET=test npm test (from ./server)
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../app');

let server;
let base;

before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, resolve);
    });
    base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve) => server.close(resolve));
});

test('GET /api/health reports degraded (503) when MongoDB is not connected', async () => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.status, 503);
    const body = await res.json();
    assert.equal(body.status, 'degraded');
    assert.equal(body.db, 'disconnected');
    assert.equal(typeof body.uptimeSeconds, 'number');
});

test('unknown /api path returns a JSON 404', async () => {
    const res = await fetch(`${base}/api/does-not-exist`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { message: 'Not found' });
});
