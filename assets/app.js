exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { password } = JSON.parse(event.body || '{}');
    const ADMIN_PW = process.env.ADMIN_PW;

    if (!ADMIN_PW) {
      return { statusCode: 500, headers, body: JSON.stringify({ ok: false, msg: 'Server error: env not set' }) };
    }

    if (!password) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, msg: 'No password' }) };
    }

    // Timing-safe compare supaya tidak bisa ditebak lewat timing attack
    const crypto = require('crypto');
    const a = Buffer.from(password);
    const b = Buffer.from(ADMIN_PW);
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (match) {
      // Buat token sesi sederhana (random + timestamp)
      const token = crypto.randomBytes(32).toString('hex') + '.' + Date.now();
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, token }) };
    } else {
      return { statusCode: 401, headers, body: JSON.stringify({ ok: false, msg: 'Wrong password' }) };
    }
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, msg: 'Server error' }) };
  }
};
