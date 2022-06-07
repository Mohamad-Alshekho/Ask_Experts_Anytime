const db = require('../util/database');

module.exports = class Rating {
    constructor(userId, expertId, rating, ratingId) {
        this.ratingId = ratingId;
        this.userId = userId;
        this.expertId = expertId;
        this.rating = rating;
        
    } 

    add() {
        return db.execute('insert into Rating (userId, expertId, rating) values (?, ?, ?)',
                    [this.userId, this.expertId, this.rating]   
                  );
    }

    fetchAll() {
        return db.execute('select * from Rating');
    }

    // findById(questionId) {
    //     return db.execute('select * from Question where questionId= ?',[questionId]);
    // }
    // deleteById(questionId) {
    //     return db.execute('delete from Question where questionId= ?',[questionId]);
    // }

}