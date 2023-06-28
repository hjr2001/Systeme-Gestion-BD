
class Column{


    constructor(name, type = 'String', auto = false, required = false){
        this.name = name;
        this.type = type;
        this.auto = auto;
        this.required = required;
    } 

}

module.exports = Column;