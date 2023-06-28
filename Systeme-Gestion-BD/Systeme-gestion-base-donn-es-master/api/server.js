const http = require('http');
const url = require('url');
const System = require('./classes/System');

const Cell = require('./classes/Cell');
const Column = require('./classes/Column');
const Database = require('./classes/Database');
const Row = require('./classes/Row');
const Table = require('./classes/Table');

const DELETE = require('./requistHandlers/delete');
const GET = require('./requistHandlers/get');
const POST = require('./requistHandlers/post');
const PUT = require('./requistHandlers/put');
const Helper = require('./classes/Helper');

const port = process.env.PORT || 3000


global.SYSTEM = new System();

const server = http.createServer((req, res) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

    const { pathname:route } = url.parse(req.url);
    console.log(route);
    if (req.method === 'GET') {
        GET(route, req, res);
    }
    else if (req.method === 'POST') {
        POST(route, req, res);
    }
    else if (req.method === 'DELETE') {
        DELETE(route, req, res);
    }
    else if (req.method === 'PUT') {
        PUT(route, req, res);
    }
    else {
        Helper.sendJsonRes(res, {
            error : true,
            message : 'NOT FOUND'
        });
    }
});

server.listen(port, ()=>{
    SYSTEM.load()
});

process.stdin.resume();
process.on('exit', ()=>{
    SYSTEM.save()
});
process.on('SIGINT', ()=>{
    SYSTEM.save()
});