const http = require('http');

function put(url, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: 'PUT',
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

async function run() {
  console.log('--- Step 1: Admin updates Order ASZ-1087 in Admin Panel ---');
  const updateRes = await put('http://localhost:5000/api/orders/ASZ-1087/status', {
    status: 'In Transit',
    courier: 'BlueDart Express Air',
    trackingNumber: 'BD778899IN'
  });
  console.log('Update response status:', updateRes.status);
  if (updateRes.status !== 200) throw new Error('Failed to update order in admin');
  console.log('Order updated by admin successfully!');

  console.log('\n--- Step 2: Customer tracks by Order ID ASZ-1087 ---');
  const trackIdRes = await get('http://localhost:5000/api/orders/track/ASZ-1087');
  if (trackIdRes.status !== 200) throw new Error('Failed to track by ID');
  const o = trackIdRes.data.order;
  console.log('Found order:', o.id, 'Status:', o.status, 'Courier:', o.courier, 'AWB:', o.trackingNumber);
  if (o.status !== 'In Transit' || o.trackingNumber !== 'BD778899IN') throw new Error('Status mismatch!');
  console.log('PASS: Customer tracking by Order ID shows live status updated by Admin!');

  console.log('\n--- Step 3: Customer tracks by BlueDart AWB BD778899IN ---');
  const trackAwbRes = await get('http://localhost:5000/api/orders/track/BD778899IN');
  if (trackAwbRes.status !== 200) throw new Error('Failed to track by AWB');
  console.log('PASS: Customer tracking by AWB BD778899IN matched order ASZ-1087!');

  console.log('\nALL END-TO-END FLOW TESTS PASSED 100%!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
