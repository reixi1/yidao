const https = require('https');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET'
            },
            body: ''
        };
    }

    const key = event.queryStringParameters && event.queryStringParameters.key;
    if (!key) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: '缺少 API Key' })
        };
    }

    return new Promise((resolve) => {
        const url = `https://api.t1qq.com/api/tool/lr?key=${encodeURIComponent(key)}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    body: data
                });
            });
        }).on('error', (err) => {
            resolve({
                statusCode: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: '请求失败：' + err.message })
            });
        });
    });
};