const databaseControllers = require("../controllers/database.controller");
const tableControllers = require("../controllers/table.controller");

function GET(route, req, res) {

    switch (route) {
        case '/serverStatus':
            databaseControllers.names(req, res);
        break;
        case '/databases':
            databaseControllers.names(req, res);
        break;
        case '/database/tables':
            databaseControllers.tables(req, res);
        break;
        case '/database/table':
            tableControllers.table(req, res);
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

module.exports = GET