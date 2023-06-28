const Row = require("./Row")

class Table {

    constructor(name){
        this.name = name
        this.index = 1
        this.columns = []
        this.rows = []
        this.rowsCount = 0
    }

    addColumn(column){
        const isExist = this.isColumnExist(column.name) != -1
        if (isExist) {
            return false
        }
        this.columns.push(column);
        return true
    }

    getColumn(columnName){

        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].name == columnName) {
                return this.columns[i]
            }
        }
        return null
    }

    addRow(row){
        this.rows.push(row)
        this.rowsCount++
    }

    isColumnExist(columnName){
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].name == columnName) {
                return i
            }
        }
        return -1
    }

    search(condition){
        let newArray = []
        for (let i = 0; i < this.rows.length; i++) {
            const object = this.rows[i].toSingleObject()
            try {
                if (eval(condition)) {
                    newArray.push(this.rows[i])
                }
            } catch (error){
                return null
            }
        }
        return newArray
    }

    removeRows(condition){
        let newArray = []
        for (let i = 0; i < this.rows.length; i++) {
            const object = this.rows[i].toSingleObject()
            try {
                if(!eval(condition)) {
                    newArray.push(this.rows[i])
                }
                else {
                    this.rowsCount--
                }
            } catch (error){
                return null
            }
        }
        this.rows = newArray
        return this.rows
    }

    updateRow(condition, newRow){
        for (let i = 0; i < this.rows.length; i++) {
            const object = this.rows[i].toSingleObject()
            try {
                if(eval(condition)) {
                    let r = new Row();
                    this.columns.forEach(column => {
                        if (!column.auto) {
                            if (newRow.getCell(column.name).value != undefined) {
                                this.rows[i].updateCell(column.name, newRow.getCell(column.name).value)
                            }
                        }
                    });
                }
            } catch (error){
                console.log(error);
                return null
            }
        }
        return this.rows
    }

    autoIncrement(){
        const index = this.index;
        this.index++
        return index
    }

}

module.exports = Table;
