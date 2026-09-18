const https = require('https');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' },
            body: ''
        };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: false, error: { message: 'POST only' } }) };
    }

    const ep = (event.queryStringParameters && event.queryStringParameters.ep) || '';
    if (!ep) {
        return { statusCode: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: false, error: { message: 'Missing ep' } }) };
    }

    const body = event.body || '{}';

    return new Promise((resolve) => {
        const req = https.request({
            hostname: 'aov.cc',
            path: '/api/v1' + ep,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: data }));
        });
        req.on('error', (err) => resolve({ statusCode: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: false, error: { message: err.message } }) }));
        req.write(body);
        req.end();
    });
};