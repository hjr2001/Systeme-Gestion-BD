const http = require("http");

const databaseControllers = require("../controllers/database.controller");
const tableControllers = require("../controllers/table.controller");
const rowControllers = require("../controllers/row.controller");

function POST(route, req, res) {
    
    switch (route) {
        case '/database/create':
            databaseControllers.create(req, res);
        break;
        case '/table/create':
            tableControllers.add(req, res);
        break;
        case '/table/search':
            rowControllers.search(req, res);
        break;
        case '/table/addRow':
            rowControllers.add(req, res);
        break;
        default:
            return Helper.sendJsonRes(res, {
                error : true,
                message : 'NOT FOUND'
            },
            404
            );
    }
    
}

module.exports = POST