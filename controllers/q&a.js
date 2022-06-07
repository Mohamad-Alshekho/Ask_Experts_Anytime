const fs = require('fs');
const path = require('path');

const stripe = require('stripe')('sk_test_51Jt44GHL6PH8xryFZW9pAUJAgEguqjot3BPLS6gaMEJqxpIatRZIUas19LkLZGlK16yLFT3SE72vNFVLctp3arfF00Rken2XKR');

const Expert = require('../models/expert');
const expert = new Expert();
const Post = require('../models/post');
const post = new Post();
const User = require('../models/user');
const user = new User();
const Comment = require('../models/comment');
const comment = new Comment();
const Question = require('../models/question');
const question = new Question();
const Answer = require('../models/answer');
const { subscribe } = require('../routes/feed');
const answer = new Answer();
const Subscription = require('../models/subscription');
const { start } = require('repl');
const { render } = require('ejs');
const subscription = new Subscription();

exports.getExperts = (req, res, next) => {
    let account = req.user;
    if(req.user){ // if signed in 
        console.log('is expert or not');
        console.log(account.isExpert);
        expert.fetchAll()
    .then(experts => {
        console.log(experts[0]);
        res.render('experts', {
            experts: experts[0],
           isExpert: account.isExpert,
           account: account,
           isExpert: account.isExpert,
           expert,
           page: 'experts'
        });
    })
    .catch(err => {
        console.log(err);
        if(!err.satausCode){
            err.statusCode = 500;
        }
        next(err);
    });
    }
    else{  // if guest
        expert.fetchAll()
        .then(experts => {
            console.log(experts[0]);
            res.render('experts', {
                experts: experts[0],
                isExpert: 0,
               account,
               page: 'experts'
            });
        })
        .catch(err => {
            console.log(err);
            if(!err.satausCode){
                err.statusCode = 500;
            }
            next(err);
        });
    }
   
    
}

exports.getPricing = (req, res, next) => {
    const account = req.user;
    if(!account){
        return res.render('pricing', {
            sessionId: 1,
            page: 'pricing'
        });
    }
    const accountId = account.accountId;
    if(account.isExpert == 1) {
        return res.render('pricing', {
            account: account,
            expert,
            sessionId: 1,
            page: 'pricing'
        })
    }
    user.findByAccount(accountId)
    
    .then(user => {
        user = user[0][0];
        let userId = user.userId;
        subscription.fetch(userId)
        .then(sub => {
             sub = sub[0][0];
            console.log(sub);
            if(sub) {
                var date = new Date();
                var leftDays = Math.floor((sub.expiryDate - date) / (1000*60*60*24))
                console.log(leftDays); 
                if(leftDays > 0 && sub.remainingQ > 0) {// if the user already subscribed and still has remaining questions and days.
                    res.render('pricing', {
                        userId: userId,
                        account: account,
                        sub: sub,
                        sessionId: 1,
                        page: 'pricing'
                    });
                }
                else{ // if subscribed but the subscription expired.
                    return stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        line_items: [{
                            name: 'test',
                            description: '1 month subscription',
                            amount: 15 * 100,
                            currency: 'usd',
                            quantity: 1
                        }],
                        success_url: req.protocol + '://' +  req.get('host') + '/paymentSuccess',
                        cancel_url: req.protocol + '://' +  req.get('host') + '/pricing'
                        
                    })
                    .then(session => {
                        res.render('pricing', {
                            sessionId: session.id,
                            account: account,
                            page: 'pricing'
                        });
                    })
                }
            }
            else{ // if a user subscribes for the first time.
                return stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        name: 'test',
                        description: '1 month subscription',
                        amount: 15 * 100,
                        currency: 'usd',
                        quantity: 1
                    }],
                    success_url: req.protocol + '://' +  req.get('host') + '/paymentSuccess',
                    cancel_url: req.protocol + '://' +  req.get('host') + '/pricing'
                    
                })
                .then(session => {
                    res.render('pricing', {
                        sessionId: session.id,
                        account: account,
                        sub,
                        page: 'pricing'
                    });
                })
            }
            
        })
        .catch(err => {
            console.log(err);
            if(!err.satausCode){
                err.statusCode = 500;
            }
            next(err);
        });
        
    })

    
    // return stripe.checkout.sessions.create({
    //     payment_method_types: ['card'],
    //     line_items: [{
    //         name: 'test',
    //         description: '1 month subscription',
    //         amount: 15 * 100,
    //         currency: 'usd',
    //         quantity: 1
    //     }],
    //     success_url: req.protocol + '://' +  req.get('host') + '/paymentSuccess',
    //     cancel_url: req.protocol + '://' +  req.get('host') + '/pricing'
        
    // })
    // .then(session => {
    //     res.render('pricing', {
    //         sessionId: session.id,
    //         account: account
    //     });
    // })
    
}

exports.paymentHandler = (req, res, next) => {

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    
    var date = new Date();
    var expiryDate = (date.addDays(30)).toISOString();
    console.log(expiryDate);
    expiryDate = expiryDate.substring(0,10);
    var startDate = (date.toISOString()).substring(0, 10);
    let account = req.user;
    let accountId = account.accountId;
    user.findByAccount(accountId)
            .then(user => {
               const userId = user[0][0].userId; //subId, userId, startDate, expiryDate, remainingQuesitons
               
               subscription.fetch(userId)
               .then(sub => {
                    sub = sub[0][0];
                    if(sub){
                        subscription.editUser(userId, startDate, expiryDate, 15)
                        .then(sub => {
                            res.redirect('/feed');
                        })
                        
                    }
                    else{
                        //subId, userId, startDate, expiryDate, remainingQuesitons
                        subscription.addUser(1, userId, startDate, expiryDate, 15);
                        res.redirect('/feed');
                    }
                })    
            })
            .catch(err => {
                console.log(err);
                if(!err.satausCode){
                    err.statusCode = 500;
                }
                next(err);
            });
}

exports.getDashboard = (req, res, nect) => {
    const account = req.user;
    const accountId = account.accountId;
    console.log('getting the appropriate dashboard');
        const isExpert = account.isExpert;
        if(account.isAdmin){
            expert.fetchApp()
            .then(experts => {
                console.log('we found the applicants');
                console.log(experts[0]);
                res.render('admin-dashboard', {
                    account: account,
                    experts: experts[0],
                    page: 'dashboard'
                });
            })
            .catch(err => {
                console.log(err);
                if(!err.satausCode){
                    err.statusCode = 500;
                }
                next(err);
            });

            
        }
        else if(isExpert){     // if the account is for an expert.
            expert.findByAccount(accountId)
            .then(expert => {
                console.log('we found the expert');
                console.log(expert[0][0])
                res.render('expert-add-post',{
                    account: account,
                    expert: expert[0][0],
                    page: 'dashboard'
                });
            })
            .catch(err => {
                console.log(err);
                if(!err.satausCode){
                    err.statusCode = 500;
                }
                next(err);
            });
        }
        else {          // if the account is for user
            user.findByAccount(accountId)
            .then(user => {
                console.log('we found the user');
                console.log(user[0][0])
                const userId = user[0][0].userId;
                res.redirect('/user-questions'+ userId)
            })
            .catch(err => {
                console.log(err);
                if(!err.satausCode){
                    err.statusCode = 500;
                }
                next(err);
            });
        }

    
}



exports.getAskQuestion = (req, res, next) => {
    const expertId = req.params.expertId;
    const account = req.user;
    const accountId = account.accountId;
    console.log(expertId);
    user.findByAccount(accountId)
    .then(user => {
        user = user[0][0];
        let userId = user.userId;
        subscription.fetch(userId)
        .then(sub => {
             sub = sub[0][0];
            console.log(sub);
            if(!sub) {
                req.flash('error_msg', 'you need to subscribe to ask our experts');
                res.redirect('/subInfo' + userId);
            }
            var date = new Date();
            var leftDays = Math.floor((sub.expiryDate - date) / (1000*60*60*24))
            console.log(leftDays);
            if (leftDays > 0 && sub.remainingQ > 0){
                res.render('user-add-question', {
                    account: account,
                    userId: user.userId,
                    expertId: expertId,
                    page: 'dashboard'
                })
            }
            else{
                req.flash('error_msg', 'you need to renew your subscription');
                res.redirect('/subInfo' + userId);
                }
            
        })
        .catch(err => {
            console.log(err);
            if(!err.satausCode){
                err.statusCode = 500;
            }
            next(err);
        });
        
    })
    .catch(err => {
        console.log(err);
        if(!err.satausCode){
            err.statusCode = 500;
        }
        next(err);
    });
    
}

exports.postAskQuestion = (req, res, next) => {
    console.log(req.body);
    const content = req.body.content;
    const account = req.user;
    const expertId = req.params.expertId;
    const file = req.file;
    const accountId = account.accountId;
    user.findByAccount(accountId).then( user => {
        const userId = user[0][0].userId;
        if(!req.file){//questionId, answerId, timestamp, attachmentUrl, content, userId, expertId, isAnswered
            const question = new Question(null, null, null, null, content, userId, expertId, 0)
            question.add().then(question=> {

                subscription.ask(userId)
                .then(sub => {
                    res.redirect('/dashboard');
                });
                
                
                })
                .catch(err => {
                    console.log(err);
                    if(!err.satausCode){
                        err.statusCode = 500;
                    }
                    next(err);
                });
                
          }
          else{     //questionId, answerId, timestamp, attachmentUrl, content, userId, expertId, isAnswered
            console.log('we are at adding question with attachment');
            console.log(file.filename, content, userId, expertId, 0);
            const question = new Question(null, null, null, file.filename, content, userId, expertId)
            question.add().then(question=> {
                subscription.ask(userId)
                .then(sub => {
                    res.redirect('/dashboard');
                });
                
                
                })
                .catch(err => {
                    console.log(err);
                    if(!err.satausCode){
                        err.statusCode = 500;
                    }
                    next(err);
                });
          }
    })
}

exports.getExpertQuestions = (req, res, next) =>{
    const expertId = req.params.expertId;
    const account = req.user;
    const accountId = account.accountId;

    question.fetchAll(expertId)
    .then(questions => {
        expert.findByAccount(accountId)
            .then(expert => {
                console.log('we found the questions');
                console.log(questions[0])
                res.render('expert-questions',{
                    account: account,
                    expert: expert[0][0],
                    questions: questions[0],
                    page: 'questions'
                });
            })
            .catch(err => {
                console.log(err);
                if(!err.satausCode){
                    err.statusCode = 500;
                }
                next(err);
            });
    })
    .catch(err => {
        console.log(err);
        if(!err.satausCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.download = (req, res, next) => {
    const filename = req.params.attachmentUrl;
    console.log(filename);
    const filePath = path.join('files', filename);
    fs.readFile(filePath, (err, data) => {
        if(err){
            console.log('error while reading the file.');
           return  next(err);
        }
        res.send(data)
    });
}

exports.answerQuestion = (req, res, next) => {
    const questionId = req.params.questionId;
    console.log('here is the erq params');
    console.log(req.params);
    const content = req.body.content;
    const account = req.user;
    const file = req.file;
    const accountId = account.accountId;
    expert.findByAccount(accountId)
    .then(expert => {
        let expertId = expert[0][0].expertId;
        if(!req.file){//answerId, questionId, timestamp, attachmentUrl, content, expertId, isMarked
            console.log('we are at adding answer without attachment');
            console.log(questionId, content, expertId, 0);
            const answer = new Answer(null, questionId, null, null, content, expertId, 0)
            answer.add().then(answer=> {
                question.updateState(questionId).then( questionId => {
                    res.redirect('/getQuestions'+ expertId);
                })  
            })
            .catch(err => {
                console.log(err);
                if(!err.satausCode){
                    err.statusCode = 500;
                }
                next(err);
            });
                
          }
          else{    //answerId, questionId, timestamp, attachmentUrl, content, expertId, isMarked
            console.log('we are at adding answer with attachment');
            console.log(file.filename, content, expertId, 0);
            const answer = new Answer(null, questionId, null, file.filename, content, expertId, 0)
            answer.add().then(answer=> {
                question.updateState(questionId).then( questionId => {
                    res.redirect('/getQuestions'+ expertId);
                })  
                
                
                })
                .catch(err => {
                    console.log(err);
                    if(!err.satausCode){
                        err.statusCode = 500;
                    }
                    next(err);
                });
          }
    })
    .catch(err => {
        console.log(err);
        if(!err.satausCode){
            err.statusCode = 500;
        }
        next(err);
    });
       
    
}

exports.getUserQuestions = (req, res, next) => {
    const userId = req.params.userId;
    const account = req.user;
    const accountId = account.accountId;
    console.log('user id is here');
    console.log(userId);
    question.fetchAllUser(userId)
    .then(questions => {
        res.render('user-questions',{
            account: account,
            userId: userId,
            questions: questions[0],
            page: 'dashboard'
        });
    })
    .catch(err => {
        console.log(err);
        if(!err.satausCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.subInfo = (req, res, next) => {
    const userId = req.params.userId;
    const account = req.user;
    console.log('user id is here');
    console.log(userId);
    subscription.fetch(userId)
    .then(subscription => {
        subscription = subscription[0][0];
        subscription.startDate = subscription.startDate.toString().substring(0,21);
        subscription.expiryDate = subscription.expiryDate.toString().substring(0,21);
        if(!subscription){
            return res.render('user-subInfo',{
                account: account,
                userId: userId,
                subscription,
                page: 'dashboard'
            });      
        }
        console.log(subscription);
        var date = new Date();
        var leftDays = Math.floor((subscription.expiryDate - date) / (1000*60*60*24))
        
        res.render('user-subInfo',{
            account: account,
            userId: userId,
            subscription: subscription,
            leftDays: leftDays,
            page: 'dashboard'
        });
    })
    .catch(err => {
        console.log(err);
        if(!err.satausCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.alreadySub = (req, res, next) => {
    let userId = req.params.userId;
    req.flash('success_msg', 'You are already subscribed');
    res.redirect('subInfo' + userId);
}      

