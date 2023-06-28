const fs = require('fs');

function index(req, res) {
    const indexPage = fs.readFileSync(`${__dirname}/../views/index.html`);
    res.write(indexPage);
    return res.end();
}
function error404(req, res) {
    const errorPage = fs.readFileSync(`${__dirname}/../views/error404.html`);
    res.write(errorPage);
    return res.end();
}
function serverDown(req, res) {
    const serverDownPage = fs.readFileSync(`${__dirname}/../views/serverDown.html`);
    res.write(serverDownPage);
    return res.end();
}
function database(req, res) {
    const databasePage = fs.readFileSync(`${__dirname}/../views/database.html`);
    res.write(databasePage);
    return res.end();
}

function table(req, res) {
    const tablePage = fs.readFileSync(`${__dirname}/../views/table.html`);
    res.write(tablePage);
    return res.end();
}

module.exports = { index, database, table, error404, serverDown }