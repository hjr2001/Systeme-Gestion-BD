const fs = require('fs');

class Database {

    constructor(name){
        this.name = name
        this.tables = []
        this.path = `/storage/db_${this.name}.json`
    }

    add(table){
        const isExist = this.isExist(table.name) != -1;
        if(isExist) {
            return false
        }
        this.tables.push(table);
        return true        
    }

    remove(tableName){
        const isExist = this.isExist(tableName) != -1;
        if (!isExist) {
            return false
        }

        let newTables = [];
        for (let i = 0; i < this.tables.length; i++) {
            if (this.tables[i].name != tableName) {
                newTables.push(this.tables[i])
            }
        }
        this.tables = newTables;
        return true
    }

    update(table){
        for (let i = 0; i < this.tables.length; i++) {
            if (this.tables[i].name == table.name) {
                this.tables[i] = table;
                break;
            }
        }
    }

    getTablesInfos(){
        let infos = []
        for (let i = 0; i < this.tables.length; i++) {
            infos.push({
                name : this.tables[i].name,
                rowsCount : this.tables[i].rowsCount
            })
        }
        return infos;
    }

    table(tableName){
        let table = null
        for (let i = 0; i < this.tables.length; i++) {
            if (this.tables[i].name == tableName) {
                table = this.tables[i];
                break;
            }
        }
        return table;
    }

    isExist(tableName){
        for (let i = 0; i < this.tables.length; i++) {
            if (this.tables[i].name == tableName) {
                return i
            }
        }
        return -1
    }

    save(){
        if (fs.existsSync(`${__dirname}/../${this.path}`)) {
            fs.unlinkSync(`${__dirname}/../${this.path}`)
        } 
        fs.writeFileSync(`${__dirname}/../${this.path}`, JSON.stringify(this));
    }
}

module.exports = Database