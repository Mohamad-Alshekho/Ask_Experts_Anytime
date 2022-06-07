const { use } = require('../routes/feed');
const db = require('../util/database');

module.exports = class Expert {
    constructor(expertId, iban, isEmployed, avgResTime, accountId, cvLink, category) {
        this.expertId = expertId;
        this.iban = iban;
        this.isEmployed = isEmployed;
        this.avgResTime = avgResTime;
        this.accountId = accountId;
        this.cvLink = cvLink;
        this.category = category;
    } 

    add() {
        return db.execute('insert into Expert (iban, isEmployed, avgResTime, accountId, cvLink, category) values (?, ?, ?, ?, ?, ?)',
                    [this.iban, this.isEmployed, this.avgResTime, this.accountId, this.cvLink, this.category]   
                  );
    }

    fetchAll() {
        return db.execute(` select e.expertId, a.accountId, e.field, concat(a.name, ' ', a.surname) as fullname, a.about, a.photoLink from Expert e, account a where e.accountId = a.accountId and e.isEmployed = 1`);
    }

    fecthTop() {
        return db.execute(`select * from Expert e, account a
                            where e.accountId = a.accountId and e.isEmployed = 1
                            limit 3`);
    }

    fetchApp() {
        return db.execute(` select e.expertId, a.accountId, e.field, e.cvLink,  concat(a.name, ' ', a.surname) as fullname, a.about, a.photoLink from Expert e, account a where e.accountId = a.accountId and e.isEmployed = 0`);
    }

    findById(expertId) {
        return db.execute('select * from Expert where expertId= ?',[expertId]);
    }

    findByAccount(accountId){
        return db.execute('select * from Expert where accountId = (?)', [accountId])
    }

    deleteById(expertId) {
        return db.execute('delete from Expert where expertId= ?',[expertId]);
    }

    accept(expertId) {
        return db.execute('update  Expert set isEmployed = 1 where expertId= ?',[expertId]);
    }

    decline(accountId) {
        return db.execute('delete from Account where accountId= ?',[accountId]);
    }

}