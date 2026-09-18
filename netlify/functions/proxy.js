const https = require('https');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET' },
            body: ''
        };
    }

    const params = event.queryStringParameters || {};
    const apiPath = params.path;
    const key = params.key;

    if (!key) {
        return { statusCode: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ code: -1, msg: '缺少 API Key，请在 config.js 中配置' }) };
    }
    if (!apiPath) {
        return { statusCode: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ code: -1, msg: '缺少 API 路径' }) };
    }

    const fp = { ...params };
    delete fp.path;
    const qs = Object.entries(fp).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    const url = `https://api.t1qq.com/api/tool/${apiPath}?${qs}`;

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: data }));
        }).on('error', (err) => resolve({ statusCode: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ code: -1, msg: '请求失败：' + err.message }) }));
    });
};