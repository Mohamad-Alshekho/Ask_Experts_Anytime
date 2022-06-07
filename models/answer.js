const { use } = require('../routes/feed');
const db = require('../util/database');

module.exports = class Answer {
    constructor(answerId, questionId, timestamp, attachmentUrl, content, expertId, isMarked) {
        this.answerId = answerId;
        this.questionId= questionId;
        this.timestamp= timestamp;
        this.attachmentUrl = attachmentUrl;
        this.content = content;
        this.expertId = expertId;
        this.isMarked = isMarked
    } 

    add() {
        return db.execute('insert into Answer (questionId, attachmentUrl, content, expertId) values (?, ?, ?, ?)',
                    [this.questionId, this.attachmentUrl, this.content, this.expertId]   
                  )
    }

    fetchAll() {
        return db.execute('select * from Answer');
    }

    findById(id) {
        return db.execute('select * from Answer where answerId= ?',[id]);
    }
    deleteById(id) {
        return db.execute('delete from Answer where answerId= ?',[id]);
    }

}