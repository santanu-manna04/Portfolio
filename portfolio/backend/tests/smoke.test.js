// Run with the server already running:  npm test
// Optional: API_URL=https://yourdomain.com/api npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');

const API = process.env.API_URL || 'http://localhost:5000/api';
const call = (path, opts = {}) => fetch(API + path, { headers: { 'Content-Type': 'application/json' }, ...opts });
const json = (body) => JSON.stringify(body);

test('health endpoint reports database connected', async () => {
  const res = await call('/health');
  assert.equal(res.status, 200);
  assert.equal((await res.json()).database, 'connected');
});

for (const path of ['/projects', '/certificates', '/skills', '/services', '/profile', '/profile/about']) {
  test(`public GET ${path} works`, async () => {
    const res = await call(path);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).success, true);
  });
}

const adminWrites = [
  ['POST', '/uploads/projects/64b7f0f2a1b2c3d4e5f60718/thumbnail'],
  ['POST', '/uploads/projects/64b7f0f2a1b2c3d4e5f60718/screenshots'],
  ['POST', '/uploads/certificates/64b7f0f2a1b2c3d4e5f60718/file'],
  ['DELETE', '/uploads/projects/64b7f0f2a1b2c3d4e5f60718/thumbnail'],
  ['DELETE', '/uploads/projects/64b7f0f2a1b2c3d4e5f60718/screenshots/0'],
  ['DELETE', '/uploads/certificates/64b7f0f2a1b2c3d4e5f60718/file'],
  ['POST', '/projects'], ['PUT', '/projects/64b7f0f2a1b2c3d4e5f60718'], ['DELETE', '/projects/64b7f0f2a1b2c3d4e5f60718'],
  ['POST', '/certificates'], ['PUT', '/certificates/64b7f0f2a1b2c3d4e5f60718'], ['DELETE', '/certificates/64b7f0f2a1b2c3d4e5f60718'],
  ['POST', '/skills'], ['PUT', '/skills/64b7f0f2a1b2c3d4e5f60718'], ['DELETE', '/skills/64b7f0f2a1b2c3d4e5f60718'],
  ['POST', '/services'], ['PUT', '/services/64b7f0f2a1b2c3d4e5f60718'], ['DELETE', '/services/64b7f0f2a1b2c3d4e5f60718'],
  ['PUT', '/profile'], ['PUT', '/profile/about'],
  ['GET', '/contact'], ['DELETE', '/contact/64b7f0f2a1b2c3d4e5f60718'], ['GET', '/auth/me'],
];
for (const [method, path] of adminWrites) {
  test(`${method} ${path} requires login (401)`, async () => {
    const res = await call(path, { method, body: method === 'GET' || method === 'DELETE' ? undefined : json({}) });
    assert.equal(res.status, 401);
  });
}

test('invalid project id is rejected with 400', async () => {
  assert.equal((await call('/projects/not-an-id')).status, 400);
});

test('unknown API route returns JSON 404', async () => {
  const res = await call('/does-not-exist');
  assert.equal(res.status, 404);
  assert.equal((await res.json()).success, false);
});

test('login rejects a malformed body (400) and wrong credentials (401)', async () => {
  assert.equal((await call('/auth/login', { method: 'POST', body: json({ email: 'x' }) })).status, 400);
  const bad = await call('/auth/login', { method: 'POST', body: json({ email: 'nobody@example.com', password: 'wrong-password-123' }) });
  assert.ok([401, 429].includes(bad.status));
});

test('contact form validates input', async () => {
  const res = await call('/contact', { method: 'POST', body: json({ name: 'A', email: 'bad', subject: '', message: 'short' }) });
  assert.ok([400, 429].includes(res.status));
});

test('NoSQL operator injection in login does not authenticate', async () => {
  const res = await call('/auth/login', { method: 'POST', body: json({ email: { $gt: '' }, password: { $gt: '' } }) });
  assert.ok([400, 401, 429].includes(res.status));
});

test('uploads folder blocks directory listing and traversal', async () => {
  const origin = API.replace(/\/api$/, '');
  for (const p of ['/uploads/', '/uploads/%2e%2e/.env', '/uploads/..%2f..%2f.env']) {
    const res = await fetch(origin + p);
    assert.notEqual(res.status, 200, `${p} must not return 200`);
  }
});

test('there is no public upload or register endpoint', async () => {
  for (const [m, p] of [['POST', '/auth/register'], ['POST', '/upload'], ['POST', '/uploads']]) {
    assert.equal((await call(p, { method: m, body: json({}) })).status, 404);
  }
});
