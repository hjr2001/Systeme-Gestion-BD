
const indexControllers = require("../controllers/index.controller");
const staticControllers = require("../controllers/static.controller.js");

function GET(route, req, res) {

    switch (route) {
        case '/serverDown':
            indexControllers.serverDown(req, res);
        break;
        case '/':
            indexControllers.index(req, res);
        break;
        case '/database':
            indexControllers.database(req, res);
        break;
        case '/table':
            indexControllers.table(req, res);
        break;
        case '/public/app.js':
            staticControllers.js('app.js', req, res);
        break;
        case '/public/app.css':
            staticControllers.css('app.css', req, res);
        break;
        default:
            indexControllers.error404(req, res);
    }
}

module.exports = GET