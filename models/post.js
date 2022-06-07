const { post } = require('../routes/feed');
const db = require('../util/database');

module.exports = class Post {
    constructor(postId, expertId, content, nOfLikes, nOfComments, timestamp, attachmentUrl, title) {
        this.postId = postId;
        this.expertId = expertId;
        this.content = content;
        this.nOfLikes = nOfLikes;
        this.nOfComments = nOfComments;
        this.timestamp = timestamp;
        this.attachmentUrl = attachmentUrl;
        this.title = title;
    } 

    add() {
         return db.execute('insert into Post (expertId, content, attachmentUrl, title) values (?, ?, ?, ?)',
                    [this.expertId, this.content, this.attachmentUrl, this.title]   
                  )
    }

    

    fetchAll(start, limit) {
        return db.execute(`select p.postId, p.expertId, p.content, p.nOfLikes, p.nOfComments, p.timestamp, p.attachmentUrl, p.title, a.name, a.surname, a.photoLink, e.field
        from Post p, Expert e, Account a 
        where p.expertId = e.expertId and e.accountId = a.accountId limit ?, ?`, [start, limit]);
    }

    findById(postId) {
        return db.execute('select * from Post where postId= ?',[postId]);
    }
    deleteById(postId) {
        return db.execute('delete from Post where postId= ?',[postId]);
    }
    addComment(postId) {
        return db.execute('update Post set nOfComments = nOfComments +1 where postId = ?', [postId]);
    }

}