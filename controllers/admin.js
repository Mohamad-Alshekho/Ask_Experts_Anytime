
const Expert = require('../models/expert');
const expert = new Expert();


exports.acceptExpert = (req, res, next) => {
    const expertId = req.body.expertId;
    const accountId = req.user.accountId;

    console.log(expertId);

    expert.accept(expertId).then(expert => {
        console.log('expert has been accepted');
        res.send({
            msg: 'success'
        })
    })
    .catch(err => {
        res.send({
            msg: 'error'
        });
        console.log(err);
                if(!err.satausCode){
                    err.statusCode = 500;
                }
                next(err);
    });
}

exports.declineExpert = (req, res, next) => {
    const expertId = req.body.expertId;
    // const accountId = req.user.accountId;

    console.log(expertId);
    expert.findById(expertId)
    .then(expertt => {
        accountId = expertt[0][0].accountId;
        console.log(accountId);
        expert.decline(accountId).then(expert => {
            console.log('expert has been declined');
            res.send({
                msg: 'success'
            })
        })
        .catch(err => {
            res.send({
                msg: 'error'
            });
            console.log(err);
                    if(!err.satausCode){
                        err.statusCode = 500;
                    }
                    next(err);
        });
    })
    
    
}

exports.error = (req, res, next) => {
    res.render('error');
}