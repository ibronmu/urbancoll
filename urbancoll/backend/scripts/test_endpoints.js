// Cross-platform endpoint tests using native fetch (Node 18+)
// Usage: from backend folder: `node scripts/test_endpoints.js`

const base = 'http://localhost:4000';

async function json(res) {
  try { return await res.json(); } catch (e) { return null; }
}

async function tryInvoke(method, path, body = null, token = null) {
  const url = `${base}${path}`;
  process.stdout.write(`\n==> ${method} ${url}\n`);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const b = await json(res);
    console.log(`Status: ${res.status}`);
    console.log(JSON.stringify(b, null, 2));
    return { ok: res.ok, status: res.status, body: b };
  } catch (err) {
    console.error('FAILED', err.message || err);
    return { ok: false, error: err };
  }
}

async function run() {
  await tryInvoke('GET', '/');
  await tryInvoke('GET', '/products');

  const email = `testuser_${Math.random().toString(36).slice(2,10)}@example.com`;
  const pw = 'password123';
  const registerBody = { email, password: pw, firstName: 'Node', lastName: 'Tester' };
  const r3 = await tryInvoke('POST', '/auth/register', registerBody);
  let token = null;
  if (r3.ok && r3.body?.data?.accessToken) {
    token = r3.body.data.accessToken;
    console.log('Received accessToken length=', token.length);
  }

  const loginBody = { email, password: pw };
  const r4 = await tryInvoke('POST', '/auth/login', loginBody);
  if (r4.ok && r4.body?.data?.accessToken) token = r4.body.data.accessToken;

  if (token) {
    const vendorBody = { businessName: 'Node Test Business', description: 'Created by node test script' };
    await tryInvoke('POST', '/vendors', vendorBody, token);
    await tryInvoke('GET', '/vendors/me', null, token);

    // Create a product as vendor (requires token)
    const productBody = { name: 'Test Product', description: 'Sample', price: 9.99, stock: 10 };
    const rp = await tryInvoke('POST', '/products', productBody, token);
    if (rp.ok) console.log('Product created');
    await tryInvoke('GET', '/products');
    // Create an order for the created product
    if (rp.ok && rp.body?.data?.id) {
      const productId = rp.body.data.id;
      const orderBody = { items: [{ productId, quantity: 1 }] };
      const ro = await tryInvoke('POST', '/orders', orderBody, token);
      if (ro.ok && ro.body?.data?.id) {
        const orderId = ro.body.data.id;
        console.log('Order created id=', orderId);
        // Create a payment for the order
        const paymentBody = { orderId };
        const rpmt = await tryInvoke('POST', '/payments/create', paymentBody, token);
        if (rpmt.ok) console.log('Payment created', rpmt.body?.data ?? rpmt.body);
      }
    }
  } else {
    console.warn('No token available; skipped vendor/product tests');
  }

  console.log('\nTests complete');
}

run().catch(err => { console.error('Test runner error', err); process.exit(1); });
