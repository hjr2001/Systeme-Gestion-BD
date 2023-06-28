const fs = require('fs');
const Cell = require('./Cell');
const Column = require('./Column');
const Database = require('./Database');
const Row = require('./Row');
const Table = require('./Table');

class System{

    constructor(){
        this.databases = []
        this.storagePath = `/storage`
    }

    add(database){ // done
        const isExist = this.isExist(database.name) != -1;
        if (isExist) {
            return false
        }
        this.databases.push(database)
        return true
    }

    isExist(databaseName){ // done
        for (let i = 0; i < this.databases.length; i++) {
            if (this.databases[i].name == databaseName) {
                return i
            }
        }
        return -1
    }

    getDatabaseNames(){ // done
        let names = []
        for (let i = 0; i < this.databases.length; i++) {
            names.push(this.databases[i].name);
        }
        return names;
    }

    getDatabase(databaseName){ // done
        let db = null
        for (let i = 0; i < this.databases.length; i++) {
            if (this.databases[i].name == databaseName) {
                db = this.databases[i];
                break;
            }
        }
        return db;
    }

    update(database){ // done
        for (let i = 0; i < this.databases.length; i++) {
            if (this.databases[i].name == database.name) {
                this.databases[i] = database
                break;
            }
        }
    }

    remove(databaseName){ // done
        const isExist = this.isExist(databaseName) != -1;

        if (!isExist) {
            return false
        }

        let newDatabases = []

        for (let i = 0; i < this.databases.length; i++) {
            if (this.databases[i].name != databaseName) {
                newDatabases.push(this.databases[i])
            }
        }

        this.databases = newDatabases
        return true
    }

    save(){
        this.databases.forEach(db => {
            db.save();
        });
    }

    async load(){
        fs.readdir(`${__dirname}/../${this.storagePath}`, (err, files) => {
            files.forEach(file => {
                const json = JSON.parse(fs.readFileSync(`${__dirname}/../${this.storagePath}/${file}`))
                const db = new Database(json.name)
                json.tables.forEach(table => {
                    const t = new Table(table.name)
                    t.index = table.index
                    t.rowsCount = table.rowsCount
                    table.columns.forEach(column => {
                        const col = new Column(
                            column.name,
                            column.type,
                            column.auto,
                            column.required
                        )
                        t.addColumn(col)
                    })
                    table.rows.forEach(row => {
                        const r = new Row()
                        row.cells.forEach(cell=>{
                            const ce = new Cell(cell.name, cell.value)
                            r.addCell(ce)
                        })
                        t.addRow(r)
                    })
                    db.add(t)
                });
                this.add(db)
            });
        });
    }

}

module.exports = System;