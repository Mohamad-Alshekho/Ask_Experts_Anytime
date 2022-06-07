const db = require('../util/database');

module.exports = class Comment {
    constructor(commentId, postId, userId, content, isExpert, timestamp) {
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.content = content;
        this.isExpert = isExpert;
        this.timestamp = timestamp;
    } 

    add(accountId, postId, content) {
        return db.execute('insert into Comment (postId, userId, content) values (?, ?, ?)',
                    [postId, accountId, content]   
                  );
    }

    fetchAll(postId) {
        return db.execute(`select c.content, c.timestamp, a.photoLink, concat(a.name, ' ', a.surname) as fullname
        from comment c, account a where postId = ? and a.accountId = c.userId`, [postId]);
    }

    // findById(answerId) {
    //     return db.execute('select * from Answer where ansewerId= ?',[answerId]);
    // }
    delete(commentId) {
        return db.execute('delete from Comment where commentId= ?',[commentId]);
    }

    edit(commentId, content) {
        return db.execute('update Comment set content = ? where commentId= ?', [content, commentId]);
    }

    fetchById(commentId) {
        return db.execute( `select concat(a.name, ' ', a.surname) as fullname, c.timestamp
                            from Comment c, Account a
                            where c.userId = a.accountId and commentId = ?`, [commentId]);
    }

}