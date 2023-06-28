const http = require('http');
const url = require('url');
const GET = require('./requistHandlers/get');

const server = http.createServer((req, res)=>{

    const { pathname:route } = url.parse(req.url);

    if (req.method === 'GET') {
        GET(route, req, res);
    }
})

server.listen(5000)