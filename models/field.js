const { use } = require('../routes/feed');
const db = require('../util/database');

module.exports = class Field {
    constructor(fieldId, fieldName) {
        this.fieldId = fieldId;
        this.fieldName= fieldName;
    } 

    add() {
        return db.execute('insert into Field (fieldName) values (?)',
                    [this.fieldName]   
                  );
    }

    fetchAll() {
        return db.execute('select * from Field');
    }

    findById(fieldId) {
        return db.execute('select * from Field where fieldId= ?',[fieldId]);
    }
    deleteById(fieldId) {
        return db.execute('delete from Field where fieldId= ?',[fieldId]);
    }

}