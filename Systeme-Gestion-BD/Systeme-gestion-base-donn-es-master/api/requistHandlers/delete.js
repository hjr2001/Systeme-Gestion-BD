const databaseControllers = require("../controllers/database.controller");
const tableControllers = require("../controllers/table.controller");
const rowControllers = require("../controllers/row.controller");
const Helper = require("../classes/Helper");


function DELETE(route, req, res) {
    
    switch (route) {
        case '/database/delete':
            databaseControllers.remove(req, res);
        break;
        case '/table/delete':
            tableControllers.remove(req, res);
        case '/table/deleteRows':
            rowControllers.remove(req, res);
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

module.exports = DELETE