const { use } = require('../routes/feed');
const db = require('../util/database');

module.exports = class Invoice {
    constructor(invoiceId, timestamp, dueDate, price, service, customerName, customerAddress) {
        this.invoiceId = invoiceId;
        this.timestamp= timestamp;
        this.dueDate= dueDate;
        this.price = price;
        this.service = service;
        this.customerName = customerName;
        this.customerAddress = customerAddress;
    } 

    add() {
        return db.execute('insert into Invoice (dueDate, price, service, customerName, customerAddress) values (?, ?, ?, ?, ?)',
                    [this.dueDate, this.price, this.service, this.customerName, this.customerAddress]   
                  );
    }

    fetchAll() {
        return db.execute('select * from Invoice');
    }

    findById(invoiceId) {
        return db.execute('select * from Invoice where invoiceId= ?',[invoiceId]);
    }
    deleteById(invoiceId) {
        return db.execute('delete from Invoice where invoiceId= ?',[invoiceId]);
    }

}