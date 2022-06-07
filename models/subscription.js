const db = require('../util/database');

module.exports = class Subscription {
    constructor(subId, duration, price, type, nOfQuestPerMon) {
        this.subId = subId;
        this.duration= duration;
        this.price= price;
        this.type = type;
        this.nOfQuestPerMon = nOfQuestPerMon;
    } 

    // add() {
    //     return db.execute('insert into Question (answerId, attachmentUrl, content, userId, expertId) values (?, ?, ?, ?, ?)',
    //                 [this.answerId, this.attachmentUrl, this.content, this.userId, this.expertId]   
    //               );
    // }

    // fetchAll() {
    //     return db.execute('select * from Question');
    // }

    // findById(questionId) {
    //     return db.execute('select * from Question where questionId= ?',[questionId]);
    // }
    // deleteById(questionId) {
    //     return db.execute('delete from Question where questionId= ?',[questionId]);
    // }

    addUser(subId, userId, startDate, expiryDate, remainingQuesitons) {
        return db.execute('insert into User_subscription(subId, userId, startDate, expiryDate, remainingQ) values (?, ?, ?, ?, ?)',
        [subId, userId, startDate, expiryDate, remainingQuesitons]);
    }

    fetch(userId) {
        return db.execute('select * from user_subscription where userId = ?', [userId]);
    }

    ask(userId) {
        return db.execute('update user_subscription set remainingQ= remainingQ-1 where userId= ?', [userId]);
    }

    editUser(userId, startDate, expiryDate, remainingQuesitons) {
        return db.execute('update User_subscription set startDate = ?, expiryDate = ?, remainingQ = ? where userId= ?',
        [startDate, expiryDate, remainingQuesitons, userId]);
    }

}