const db = require('../util/database');

module.exports = class Question {
    constructor(questionId, answerId, timestamp, attachmentUrl, content, userId, expertId, isAnswered) {
        this.answerId = answerId;
        this.questionId= questionId;
        this.timestamp= timestamp;
        this.attachmentUrl = attachmentUrl;
        this.content = content;
        this.userId = userId;
        this.expertId = expertId;
        this.isAnswered = isAnswered;
    } 

    add() {
        return db.execute('insert into Question ( attachmentUrl, content, userId, expertId) values (?, ?, ?, ?)',
                    [ this.attachmentUrl, this.content, this.userId, this.expertId]   
                  );
    }

    fetchAll(expertId) {
        return db.execute('select * from Question where expertId = ?', [expertId]);
    }

    fetchAllUser(userId) {
        return db.execute(`select q.questionId, q.content as qContent, q.attachmentUrl as qAttachmentUrl, q.timestamp as qTimestamp, q.isAnswered,
        a.answerId, a.attachmentUrl as aAttachmentUrl, a.content as aContent, a.expertId, a.timestamp as aTimestamp,
        concat(ac.name, ' ', ac.surname) as fullname
       from Question q left outer join Answer a on q.questionId = a.questionId
       left outer join Expert e on q.expertId = e.expertId left outer join Account ac on e.accountId = ac.accountId
        where q.userId = ?`, [userId]);
    }

    findById(questionId) {
        return db.execute('select * from Question where questionId= ?',[questionId]);
    }
    deleteById(questionId) {
        return db.execute('delete from Question where questionId= ?',[questionId]);
    }
    updateState(questionId) {
        return db.execute('update Question set isAnswered = 1 where questionId= ?',[questionId]);
    }

}