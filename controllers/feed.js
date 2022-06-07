const Post = require('../models/post');
const post = new Post();
const Comment = require('../models/comment');
const comment = new Comment();
const Account = require('../models/account');
const account = new Account();
const Expert = require('../models/expert');
const expert = new Expert();
const User = require('../models/User');
const user = new User();

////// Posts

exports.getPosts =  (req, res, next) => {
    //console.log(req.user.accountId);
    let accountId  = null;
    let expertId  = null;
    let isEmployed = null;
    console.log('we are in the route');
    //console.log(req.user); 
    if(req.user){
        
        const account = req.user;
        accountId = account.accountId;
        const isExpert = req.user.isExpert;
        if(isExpert){     // if the account is for an expert.
            expert.findByAccount(accountId)
            .then(expertt => {
                console.log('we found the expert');
                expert.fecthTop()
                .then(experts => {
                    res.render('index', {
                        expert: expertt[0][0],
                        account: account,
                        experts: experts[0],
                        page: 'feed'
                    })
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
        else {          // if the account is for user
            user.findByAccount(accountId)
            .then(user => {
                expert.fecthTop()
                .then(experts => {
                    res.render('index', {
                        user: user,
                        account : account,
                        experts: experts[0],
                        page: 'feed'
                    })
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

    }
    else{ 
        expert.fecthTop()
                .then(experts => {
                    res.render('index', {
                        experts: experts[0],
                        page: 'feed'
                    })
                })
    }
};

exports.getPostsInfo = async(req, res, next) => {
    const limit = 3;
    const page = req.query.page;

    const start = page * limit;

    let posts = await post.fetchAll(start, limit);
    posts = posts[0];
    for(let post of posts){
        let comments = await comment.fetchAll(post.postId);
        comments = comments[0];
        post.comments = comments;
        post.timestamp= post.timestamp.toString().substring(0,21);
    }
    //console.log(page);
    res.send(posts);
}

exports.postAddPost = (req, res, next) => {
    console.log(req.body);
    const title = req.body.title;
    const content = req.body.content;
    const account = req.user;
    const file = req.file;
    const accountId = account.accountId;
    expert.findByAccount(accountId).then( expert => {
        const expertId = expert[0][0].expertId;
        if(!req.file){
            const post = new Post(null, expertId, content, null, 0, null, null, title )
            post.add().then(post=> {
                res.redirect('/feed');
                
                
                })
                
          }
          else{     // postId, expertId, content, nOfLikes, nOfComments, timestamp, attachmentUrl, title
            const post = new Post(null, expertId, content, null, 0, null, file.filename, title )
            post.add().then(post=> {
                res.redirect('/feed');
                
                
                })
          }
    })
                                    //postId, expertId, content, nOfLikes, nOfComments, timestamp, attachmentUrl, title
    

        
}



exports.addComment = (req, res, next) => {
    const { postId, content } = req.body;
    const accountId = req.user.accountId;

    console.log(req.body);
    // console.log(accountId, postId, content);

    comment.add(accountId, postId, content).then(commentt => {
        post.addComment(postId)
        .then(result => {
            console.log('comment added successfully');
            comment.fetchById(commentt[0].insertId)
            .then(comment => {
                console.log(comment[0][0]);
                console.log('last query for add done successfully');
                res.send({
                    msg: 'success',
                    id: commentt[0].insertId,
                    comment: comment[0][0]
                })
            })
           
        })
        .catch(err => {
           console.log('catch the error');
            next(err);
        });
        
    })
    .catch(err => {
        console.log('we have an error');

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

exports.editComment = (req, res, next) => {
    const commentId = req.params.commentId;
    content = req.body.content;
    comment.edit(commentId, content)
    .then(comment => {
        res.send({
            msg: 'success'
        })
    }
        
    )
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
exports.deleteComment = (req, res, next) => {
    const commentId = req.params.commentId;
    comment.delete(commentId).then(comment => {
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

exports.editProfile = (req, res, next) => {
    const account = req.user;
    const accountId = req.user.accountId;
    expert.findByAccount(accountId)
    .then(expert => {
        expert = expert[0][0];
        //console.log(account.about);
        res.render('expert-edit-profile', {
            account: account,
            expert: expert,
            page: 'editProfile'
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

exports.editUserProfile = (req, res, next) => {
    const account = req.user;
    const accountId = req.user.accountId;
    user.findByAccount(accountId)
    .then(user => {
        user = user[0][0];
        //console.log(account.about);
        res.render('user-edit-profile', {
            account: account,
            user: user,
            page: 'editprofile'
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

exports.postEditProfile = (req, res, next) => {
    //const account = req.user;
    const accountId = req.user.accountId;
    const name = req.body.name;
    const surname = req.body.surname;
    const address = req.body.address;
    const phone = req.body.phone;
    const nationality = req.body.nationality;
    const about = req.body.about;
    account.update(accountId, name, surname, address, phone, nationality, about)
    .then(account => {
        account = req.user;
        if(account.isExpert == 1){
            res.redirect('/editProfile');  
        }
        else {
            res.redirect('/editUserProfile');
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







