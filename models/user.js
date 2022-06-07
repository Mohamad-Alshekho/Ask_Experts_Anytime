const db = require('../util/database');

module.exports = class User {
    constructor(userId, subId, accountId) {
        this.userId = userId;
        this.subId = subId;
        this.accountId= accountId;
    } 

    // add() {
    //     return db.execute('insert into User (subId, accountId) values (?, ?)',
    //                 [this.subId, this.accountId]   
    //               );
    // }

    // fetchAll() {
    //     return db.execute('select * from User');
    // }

    // findById(userId) {
    //     return db.execute('select * from User where userId= ?',[userId]);
    // }

    findByAccount(accountId) {
        return db.execute('select * from User where accountId= (?)', [accountId]);
    }


    // findOne(email) {
    //     return db.execute('select * from User where email= ?', [email]);
    // }

    // deleteById(userId) {
    //     return db.execute('delete from User where questionId= ?',[userId]);
    // }

}