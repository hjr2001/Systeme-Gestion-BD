const http = require("http");

const databaseControllers = require("../controllers/database.controller");
const tableControllers = require("../controllers/table.controller");
const rowControllers = require("../controllers/row.controller");

function PUT(route, req, res) {
    
    switch (route) {
        case '/table/updateRow':
            rowControllers.update(req, res);
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

module.exports = PUT