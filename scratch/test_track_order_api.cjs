const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    }).on('error', reject);
  });
}

function post(url, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('--- 1. Testing Track by Full ID: ASZ-1089 ---');
  let r = await get('http://localhost:5000/api/orders/track/ASZ-1089');
  if (r.status !== 200 || r.data.order.id !== 'ASZ-1089') throw new Error('Test 1 Failed: ' + JSON.stringify(r));
  console.log('PASS: Found order ASZ-1089, status =', r.data.order.status);

  console.log('\n--- 2. Testing Track by numeric ID only: 1089 ---');
  r = await get('http://localhost:5000/api/orders/track/1089');
  if (r.status !== 200 || r.data.order.id !== 'ASZ-1089') throw new Error('Test 2 Failed');
  console.log('PASS: 1089 resolved to', r.data.order.id);

  console.log('\n--- 3. Testing Track by #ASZ-1089 ---');
  r = await get('http://localhost:5000/api/orders/track/%23ASZ-1089');
  if (r.status !== 200 || r.data.order.id !== 'ASZ-1089') throw new Error('Test 3 Failed');
  console.log('PASS: #ASZ-1089 resolved to', r.data.order.id);

  console.log('\n--- 4. Testing Track by Phone: 9871234560 ---');
  r = await get('http://localhost:5000/api/orders/track/9871234560');
  if (r.status !== 200 || r.data.order.id !== 'ASZ-1089') throw new Error('Test 4 Failed');
  console.log('PASS: Phone matched order', r.data.order.id);

  console.log('\n--- 5. Testing Track by Phone with +91: +91 98712 34560 ---');
  r = await get('http://localhost:5000/api/orders/track/%2B91%2098712%2034560');
  if (r.status !== 200 || r.data.order.id !== 'ASZ-1089') throw new Error('Test 5 Failed');
  console.log('PASS: +91 formatted phone matched order', r.data.order.id);

  console.log('\n--- 6. Testing Track by AWB number: BD982341982IN ---');
  r = await get('http://localhost:5000/api/orders/track/BD982341982IN');
  if (r.status !== 200 || r.data.order.id !== 'ASZ-1089') throw new Error('Test 6 Failed');
  console.log('PASS: BlueDart AWB matched order', r.data.order.id);

  console.log('\n--- 7. Placing a Real New Order via POST /api/orders ---');
  const newOrder = await post('http://localhost:5000/api/orders', {
    customer: {
      name: 'Arshad Khan',
      phone: '9988776655',
      email: 'arshad@test.com',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      address: 'Hazratganj, Lucknow'
    },
    items: [
      {
        id: 'thobe-saudi-classic-white',
        name: 'Luxury Saudi Cut Pure White Arabian Thobe',
        price: 1699,
        quantity: 1,
        selectedSize: '54 (M)'
      }
    ],
    subtotal: 1699,
    total: 1699,
    paymentMethod: 'COD'
  });
  if (newOrder.status !== 201) throw new Error('Order creation failed');
  const orderId = newOrder.data.id;
  console.log('PASS: Created real new order:', orderId);

  console.log('\n--- 8. Tracking newly created order by ID:', orderId);
  r = await get(`http://localhost:5000/api/orders/track/${orderId}`);
  if (r.status !== 200 || r.data.order.id !== orderId) throw new Error('Test 8 Failed');
  console.log('PASS: Newly placed order is 100% trackable by ID!');

  console.log('\n--- 9. Tracking newly created order by Phone: 9988776655 ---');
  r = await get('http://localhost:5000/api/orders/track/9988776655');
  if (r.status !== 200 || r.data.order.id !== orderId) throw new Error('Test 9 Failed');
  console.log('PASS: Newly placed order is 100% trackable by phone number!');

  console.log('\nALL 9 TRACKING TESTS PASSED 100% PERFECTLY!');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
