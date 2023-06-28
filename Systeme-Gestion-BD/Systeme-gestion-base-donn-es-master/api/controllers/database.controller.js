const url = require('url')

const Database = require('../classes/Database')
const Helper = require('../classes/Helper')

// post
const create = (req, res) => {
    
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {

        body = body.toString();
        const { databaseName } = JSON.parse(body);

        if (databaseName == undefined || !databaseName) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : "Database name required!"
            });
        }

        const database = new Database(databaseName);

        const isAdded = SYSTEM.add(database);

        if (!isAdded) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : "nom de base de données existe deja"
            });
        }

        return Helper.sendJsonRes(res, {
            error : false, 
            message : "Done"
        });
    });
}

// delete
const remove = (req, res) => {
    
    const { databaseName } = url.parse(req.url, true).query;

    if (databaseName == undefined || !databaseName) {
        return Helper.sendJsonRes(res, {
            error : true, 
            message : "Database name required!"
        });
    }

    const isRemoved = SYSTEM.remove(databaseName)

    if (!isRemoved) {
        return Helper.sendJsonRes(res, {
            error : true, 
            message : `cette base de donnée n'existe pas! (${databaseName})`
        });
    }

    return Helper.sendJsonRes(res, {
        error : false, 
        message : "Done"
    });
}

// get
const names = (req, res) => {

    const names = SYSTEM.getDatabaseNames();

    return Helper.sendJsonRes(res, {
        error : false, 
        message : "Done",
        data : names
    });
}

// get
const tables = (req, res) => {
    const { databaseName } = url.parse(req.url, true).query;

    if (databaseName == undefined || !databaseName) {
        return Helper.sendJsonRes(res, {
            error : true, 
            message : "Database name required!"
        });
    }

    const db = SYSTEM.getDatabase(databaseName);

    if (db == null) {
        return Helper.sendJsonRes(res, {
            error : true,
            message : `cette base de donnée n'existe pas! (${databaseName})`,
        })
    }

    const tables = db.getTablesInfos()

    return Helper.sendJsonRes(res, {
        error : false,
        message : `Done`,
        data : tables
    })
}

module.exports = { create, remove, names, tables }