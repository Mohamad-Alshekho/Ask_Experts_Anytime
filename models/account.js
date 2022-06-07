const db = require('../util/database');

module.exports = class Account {
    constructor(accountId, email, password, name, surname, photoLink, nationality, about, address, phone, isAdmin, isExpert) {
        this.accountId = accountId;
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname= surname;
        this.photoLink = photoLink;
        this.nationality= nationality;
        this.about = about;
        this.address = address;
        this.phone = phone;
        this.isAdmin = isAdmin;
        this.isExpert = isExpert;
    } 

    add() {
         db.execute('insert into Account (email, password, name, surname) values (?, ?, ?, ?)',
                    [this.email, this.password, this.name, this.surname]
                  ).then(account => {
                      const accountId = account[0].insertId;
                      console.log('we have accountId');
                      return db.execute('insert into User (accountId) values (?)', [accountId])
                  })
    }

    addExpert(category, cvLink) {
         db.execute('insert into Account (email, password, name, surname, isExpert) values (?, ?, ?, ?, ?)',
                    [this.email, this.password, this.name, this.surname, 1]   
                  ).then(account => {
                      //console.log(account[0].insertId)
                      const accountId = account[0].insertId;
                         return db.execute('insert into Expert (isEmployed, accountId, cvLink, field) values (?, ?, ?, ?)', [0, accountId, cvLink, category])
                  })
    }

    fetchAll() {
        return db.execute('select * from Account');
    }

    findById(accountId) {
        return db.execute('select * from Account where accountId= ?',[accountId]);
    }

    findOne(email) {
        return db.execute('select * from Account where email= ?', [email]);
    }

    deleteById(accountId) {
        return db.execute('delete from Account where accountId= ?',[accountId]);
    }

    update(accountId, name, surname, address, phone, nationality, about) {
        return db.execute('update account set name = ?, surname = ?, address = ?, phone = ?, nationality = ?, about = ? where accountId = ?',
        [name, surname, address, phone, nationality, about, accountId]);
    }

}