class Row{

    constructor(){
        this.cells = [];
    } 
    
    addCell(cell){
        this.cells.push(cell)
    }

    getCell(cellName){
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i].name == cellName) {
                return this.cells[i]
            }
        }
        return null
    }

    updateCell(cellName, newValue){
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i].name == cellName) {
                this.cells[i].value = newValue
                break;
            }
        }
    }

    addCells(cells){
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i]
        }
    }

    toSingleObject(){
        let object = {};
        for (let i = 0; i < this.cells.length; i++) {
            const {name, value} = this.cells[i];
            object[name] = value;
        }
        return object;
    }

}

module.exports = Row;