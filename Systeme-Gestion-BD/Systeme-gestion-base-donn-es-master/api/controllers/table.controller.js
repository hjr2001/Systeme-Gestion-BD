const url = require('url');

const Column = require("../classes/Column");
const Table = require("../classes/Table");
const Helper = require("../classes/Helper");


const add = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        body = body.toString();
        try {
            body = JSON.parse(body);
        } catch (error) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : `Invalid format`
            });
        }

        const command = body;
        if (command == undefined || !command) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : "Command required!"
            });
        }

        if (command.databaseName == undefined || !command.databaseName) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : "Database name required!"
            });
        }
        console.log(command);
        if (command.tableName == undefined || !command.tableName) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : "Table name required!"
            });
        }

        const db = SYSTEM.getDatabase(command.databaseName);

        if (db == null) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : `This database does not exist! ${command.databaseName}`
            });
        }

        const newTable = new Table(command.tableName);

        let isError = false;

        command.columns.forEach(column => {

            const col = new Column(column.name, column.type, column.auto, column.required);
            
            const isAdded = newTable.addColumn(col);

            if (!isAdded) {
                isError = true;
                return Helper.sendJsonRes(res, {
                    error : true, 
                    message : `Can not create table with same name for columns! (${column.name})`
                });
            }
        });
        
        if (!isError) {
            const isAdded = db.add(newTable);

            if (!isAdded) {
                return Helper.sendJsonRes(res, {
                    error : true, 
                    message : `Table name already exist! (${command.tableName})`
                });
            }
            
            SYSTEM.update(db);

            return Helper.sendJsonRes(res, {
                error : false, 
                message : `Done!`
            });
        }
    });
}

const remove = (req, res) => { 

    const { databaseName, tableName } = url.parse(req.url, true).query;

    if (databaseName == undefined || !databaseName) {
        return Helper.sendJsonRes(res, {
            error : true, 
            message : "Database name required!"
        });
    }

    if (tableName == undefined || !tableName) {
        return Helper.sendJsonRes(res, {
            error : true, 
            message : "Table name required!"
        });
    }

    const db = SYSTEM.getDatabase(databaseName);

    if (db == null) {
        return Helper.sendJsonRes(res, {
            error : true,
            message : `This Database does not exist! (${databaseName})`
        })
    }

    const isDeleted = db.remove(tableName)

    if (!isDeleted) {
        return Helper.sendJsonRes(res, {
            error : true,
            message : `this table does not exist! (${tableName})`
        })
    }

    db.remove(tableName)

    SYSTEM.update(db);

    return Helper.sendJsonRes(res, {
        error : false,
        message : 'Done'
    })         
    
}

const table = (req, res) => { 

    const { databaseName, tableName } = url.parse(req.url, true).query;

    if (databaseName == undefined || !databaseName) {
        return Helper.sendJsonRes(res, {
            error : true, 
            message : "Database name required!"
        });
    }

    if (tableName == undefined || !tableName) {
        return Helper.sendJsonRes(res, {
            error : true, 
            message : "Table name required!"
        });
    }
    
    const db = SYSTEM.getDatabase(databaseName);

    if (db == null) {
        return Helper.sendJsonRes(res, {
            error : true,
            message : `This Database does not exist! (${databaseName})`,
        })
    }

    const table = db.table(tableName);

    if (table == null) {
        return Helper.sendJsonRes(res, {
            error : true,
            message : `This table does not exist! (${tableName})`
        })
    }

    return Helper.sendJsonRes(res, {
        error : false,
        message : 'Done',
        data : table
    })

}

module.exports = { add , table, remove }