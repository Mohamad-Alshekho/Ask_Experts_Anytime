const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key:'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'
  }
}));
const Field = require('../models/field');
const field = new Field();

const fs = require('fs');
const path = require('path');

const Account = require('../models/account');
const Post = require('../models/post');
const account = new Account();


exports.getSignUpUser = (req, res, next) => {
  res.render('userSignUp');
};

exports.postUserSignUp = (req, res, next) => {
  //console.log(req.body);
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  account.findOne(email).then(result => {
    if(result[0].length != 0){
      req.flash('error_msg', 'this email already exists');
      console.log('existed email');
    console.log(result[0]);
    return res.redirect('/auth/userSignUp');
    
  }

  if(password !== confirmPassword) {
    fs.unlink()
    req.flash('error_msg', 'passwords do not match');
    console.log('passwords do not match');
    return res.redirect('/auth/userSignUp');
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPw => { //accountId, email, password, name, surname, photoLink, nationality, about, address, phone, isAdmin, isExpert
        const account = new Account(null, email, hashedPw, name, surname, null, null, null, null, null, null, 0);
        return account.add()
        
        })
        .then(result => {
          res.redirect('/auth/login');
          // return transporter.sendMail({
          //   to: email,
          //   from: ['mhamadshe@gmail.com'],
          //   subject: 'Signup succeeded!',
          //   html: '<h1>You successfully signed up!</h1>'
          // });
    })
    
    .catch(err => {
      console.log('error from database !!');
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  })
 
  
};

exports.getExpertSignUp = (req, res, next) => {
  field.fetchAll()
  .then(fields => {
    //console.log(fields[0]);
    res.render('expertSignUp',{
      fields: fields[0]
    });
  })
}

exports.postExpertSignUp = (req, res, next) => {

  if(!req.file){
    req.flash('error_msg', 'please upload your cv as  image, pdf or docx');
    return res.redirect('/auth/expertSignUp');
  }

  console.log(req.body);
  const name = req.body.name;
  const surname = req.body.surname;
  const cv = req.file;
  const category = req.body.category;
  console.log(cv);
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  console.log('////////////////////////////////////////');
  console.log(cv.filename);
  if(!cv) {
    req.flash('error_msg', 'CV not uploaded, please upload image, pdf or docx.');
    return res.redirect('/auth/expertSignUp');
  }

  if(!category) {
    req.flash('error_msg', 'you must select a category.');
    filePath = path.join(__dirname, '../files',cv.filename);
    console.log(filePath);
    fs.unlink(filePath, err =>{console.log(err)});// clear the file if the category is not selected.
    return res.redirect('/auth/expertSignUp');
  }

  account.findOne(email).then(result => {
    if(result[0].length != 0){
      req.flash('error_msg', 'this email already exists');
      console.log('existed email');
    //console.log(result[0]);
    filePath = path.join(__dirname, '../files',cv.filename);
    console.log(filePath);
    fs.unlink(filePath, err =>{console.log(err)});// clear the file if the account is not registered due to already registered email.
    return res.redirect('/auth/expertSignUp');
    
  }

  if(password !== confirmPassword) {
    req.flash('error_msg', 'passwords do not match');
    console.log('passwords do not match');
    filePath = path.join(__dirname, '../files',cv.filename);
    console.log(filePath);
   fs.unlink(filePath, err =>{console.log(err)});// clear the file if the account is not registered due to not matching passwords.
    return res.redirect('/auth/expertSignUp');
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPw => { //accountId, email, password, name, surname, photoLink, nationality, about, address, phone, isAdmin, isExpert
      const account = new Account(null, email, hashedPw, name, surname, null, null, null, null, null, null, 1);
        return account.addExpert(category, cv.filename);
        
        })
        .then(result => {
          res.redirect('/auth/login');
          // return transporter.sendMail({
          //   to: email,
          //   from: 'shop@node-complete.com',
          //   subject: 'Signup succeeded!',
          //   html: '<h1>You successfully signed up!</h1>'
          // });
    })
    
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  })
 
  

}

exports.getLogin = (req, res, next) => {
  res.render('login');
}

exports.postLogin = (req, res, next) => {
  console.log(req.body);

  let email = req.body.email;
  let password = req.body.password;

  passport.authenticate('local', {failureFlash: true},function(err, user, info) {
    if(err){
      return next(err);
    }
    
    if(!user){
      req.flash('error_msg', info.message);
      return res.redirect('/auth/login');
    }

    req.login(user, function(err){
      if(err){
        return next(err);
      }
      return res.redirect('/feed');
    })
  })(req, res, next);
}

exports.getLogOut = (req, res, next) => {
  res.redirect('/auth/postLogout');
}

exports.postLogout = (req, res, next) => {
  console.log('this is the logout handler');
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
}

exports.getResetPassword = (req, res, next) => {
  res.render('reset-password');

}

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;
  account.findOne(email)
  .then(result => {
    if(result[0].length != 0){ // email found
      
    
  }
  else{// email not found
    req.flash('error_msg', 'this email is not registered');
      console.log('existed email');
    console.log(result[0]);
    return res.redirect('/auth/resetPassword');
  }
  })
  .catch();

}
