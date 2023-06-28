const url = require('url');

const Column = require("../classes/Column");
const Table = require("../classes/Table");
const Helper = require("../classes/Helper");
const Row = require('../classes/Row');
const Cell = require('../classes/Cell');


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
                message : `format invalide`
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
                message : `cette base de donnée n'existe pas! ${command.databaseName}`
            });
        }

        const table = db.table(command.tableName);

        if (table == null) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : `cette table n'existe pas! ${command.tableName}`
            });
        }

        const columns = table.columns;

        let error = false;

        columns.forEach(column => {
            if (column.required && !column.auto && (command.rows[column.name] == null || command.rows[column.name] == undefined || !command.rows[column.name])) {
                error = true;
                return Helper.sendJsonRes(res, {
                    error : true, 
                    message : `Column ${column.name} not null`
                });
            }
            if (column.type == 'Number' &&  typeof command.rows[column.name] != "number" && !column.auto && column.required){
                error = true;
                return Helper.sendJsonRes(res, {
                    error : true, 
                    message : `cette column (${column.name}) accepte que les nombres`
                });
            }
        });
        if(error) return;

        let row = new Row()

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.auto && column.type == 'Number') {
                const cell = new Cell(column.name, table.autoIncrement())
                row.addCell(cell);
            }
            else if (column.type == 'Number') {
                if (!command.rows[column.name]) {
                    const cell = new Cell(column.name, 0)
                    row.addCell(cell);
                } else {
                    const cell = new Cell(column.name, command.rows[column.name])
                    row.addCell(cell);
                }
            }
            else {
                const cell = new Cell(column.name, command.rows[column.name])
                row.addCell(cell);
            }
        }

        table.addRow(row);

        db.update(table);

        SYSTEM.update(db);

        return Helper.sendJsonRes(res, {
            error : false, 
            message : `Done!`
        });
        
    });
}

const search = (req, res) => {
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
                message : `format invalide`
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
                message : `cette base de donnée n'existe pas! ${command.databaseName}`
            });
        }

        const table = db.table(command.tableName);

        if (table == null) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : `cette table n'existe pas! ${command.tableName}`
            });
        }


        const search = command.search;
        
        let condition = ''
        
        // Object.entries(search).forEach(object => {
        //     const [key, value] = object;
        //     if (!key.includes('logicalOperator')) {
        //         if (value.operator == 'like') {
        //             condition += ` object.${key}.includes(${typeof value.value == 'number' ? value.value : `'${value.value}'`})`
        //         } else if (value.operator == 'not') {
        //             condition += ` object.${key} != ${typeof value.value == 'number' ? value.value : `'${value.value}'`}`
        //         }
        //         else{
        //             condition += ` object.${key} ${value.operator== '=' ? '==' : value.operator} ${typeof value.value == 'number' ? value.value : `'${value.value}'`} `
        //         }
        //     } else {
        //         condition += ` ${value} `
        //     }
        // });

        Object.entries(search).forEach(object => {
            const [key, value] = object;
            if (value.operator == 'like') {
                condition += ` object.${key}.includes(${typeof value.value == 'number' ? value.value : `'${value.value}'`})`
            } else if (value.operator == 'not') {
                condition += ` object.${key} != ${typeof value.value == 'number' ? value.value : `'${value.value}'`}`
            }
            else{
                condition += ` object.${key} ${value.operator== '=' ? '==' : value.operator} ${typeof value.value == 'number' ? value.value : `'${value.value}'`} `
            }
            condition += ` && ` 
        });

        console.log(condition);

        if (condition.trim().endsWith('&&') /*||  condition.trim().endsWith('||')*/) {
            condition = condition.trim().slice(0, -2)
        }

        if (!condition) {
            return Helper.sendJsonRes(res, {
                error : false, 
                message : `Done!`,
                data : table.rows
            },
            200
            );
        }

        const rows = table.search(condition)

        if (rows == null) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : `Logical operators are required if there are 2 or more conditions!`
            });
        }

        return Helper.sendJsonRes(res, {
            error : false, 
            message : `Done!`,
            data : rows
        });
        
    });
}

const remove = (req, res) => {
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
                message : `cette base de donnée n'existe pas! ${command.databaseName}`
            });
        }

        const table = db.table(command.tableName);

        if (table == null) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : `cette table n'existe pas! ${command.tableName}`
            });
        }


        const search = command.search;
        
        let condition = ''
        
        Object.entries(search).forEach(object => {
            const [key, value] = object;
            if (value.operator == 'like') {
                condition += ` object.${key}.includes(${typeof value.value == 'number' ? value.value : `'${value.value}'`})`
            } else if (value.operator == 'not') {
                condition += ` object.${key} != ${typeof value.value == 'number' ? value.value : `'${value.value}'`}`
            }
            else{
                condition += ` object.${key} ${value.operator== '=' ? '==' : value.operator} ${typeof value.value == 'number' ? value.value : `'${value.value}'`} `
            }
            condition += ` && ` 
        });

        console.log(condition);

        if (condition.trim().endsWith('&&') ||  condition.trim().endsWith('||')) {
            condition = condition.trim().slice(0, -2)
        }

        if (!condition) {
            return Helper.sendJsonRes(res, {
                error : false, 
                message : `Done!`,
                data : table.rows
            });
        }

        const rows = table.removeRows(condition)

        console.log(table);

        db.update(table)

        SYSTEM.update(db)

        if (rows == null) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : `Something went wrong...`,
            });
        }

        return Helper.sendJsonRes(res, {
            error : false, 
            message : `Done!`,
            data : rows
        });
        
    });
}

const update = (req, res) => {
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
                message : `cette base de donnée n'existe pas! ${command.databaseName}`
            });
        }

        const table = db.table(command.tableName);

        if (table == null) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : `cette base de donnée n'existe pas! ${command.tableName}`
            });
        }


        const search = command.search;
        
        let condition = ''

        console.log(command);
        
        Object.entries(search).forEach(object => {
            const [key, value] = object;
            if (value.operator == 'like') {
                condition += ` object.${key}.includes(${typeof value.value == 'number' ? value.value : `'${value.value}'`})`
            } else if (value.operator == 'not') {
                condition += ` object.${key} != ${typeof value.value == 'number' ? value.value : `'${value.value}'`}`
            }
            else{
                condition += ` object.${key} ${value.operator== '=' ? '==' : value.operator} ${typeof value.value == 'number' ? value.value : `'${value.value}'`} `
            }
            condition += ` && ` 
        });

        console.log(condition);

        if (condition.trim().endsWith('&&') ||  condition.trim().endsWith('||')) {
            condition = condition.trim().slice(0, -2)
        }

        if (!condition) {
            return Helper.sendJsonRes(res, {
                error : false, 
                message : `Done!`,
                data : table.rows
            });
        }

        const columns = table.columns;

        let error = false;

        Object.entries(command.rows).forEach(object => {
            const [key, value] = object;
            const c = table.getColumn(key)
            if (c.required && !c.auto && (value == null || value == undefined || !value)) {
                error = true;
                return Helper.sendJsonRes(res, {
                    error : true, 
                    message : `Column ${c.name} not null`
                });
            }
            if (c.type == 'Number' &&  typeof row.value != "number" && !c.auto && c.required){
                error = true;
                return Helper.sendJsonRes(res, {
                    error : true, 
                    message : `This column (${column.name}) accepts numbers only`
                });
            }
        });

        if(error) return;

        let row = new Row()

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.auto && column.type == 'Number') {
                const cell = new Cell(column.name, -1)
                row.addCell(cell);
            }
            else if (column.type == 'Number') {
                if (!command.rows[column.name]) {
                    const cell = new Cell(column.name, 0)
                    row.addCell(cell);
                } else {
                    const cell = new Cell(column.name, command.rows[column.name])
                    row.addCell(cell);
                }
            }
            else {
                const cell = new Cell(column.name, command.rows[column.name])
                row.addCell(cell);
            }
        }

        const rows = table.updateRow(condition, row)

        db.update(table)

        SYSTEM.update(db)

        if (rows == null) {
            return Helper.sendJsonRes(res, {
                error : true, 
                message : `Something went wrong...`,
            });
        }

        return Helper.sendJsonRes(res, {
            error : false, 
            message : `Done!`,
            data : rows
        });
        
    });
}


module.exports = { add, search, remove, update }