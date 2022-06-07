const express = require('express');
const path = require ('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const passport = require('passport');

const flash = require('connect-flash');
const session = require('express-session');

config = require('./config/passport')(passport);

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const q_a_Routes = require('./routes/q&a');
const adminRoutes = require('./routes/admin');

const db = require('./util/database');
const { DATE } = require('sequelize');
const { Console } = require('console');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString()+'-'+file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ){
        cb(null, true);
    }
    else{
        cb(null, false);
    }

}

//app.use(bodyParser.json()); //application/json

app.use(express.urlencoded({ extended: true }));



  // Connect flash
app.use(flash());

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('attachment'));
app.use( express.static(path.join(__dirname, 'files')));

// app.use((req, res, next)=> {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });


// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use( feedRoutes);
app.use('/auth', authRoutes);
app.use(q_a_Routes);
app.use(adminRoutes);

app.all('*', (req, res) => {
    res.redirect('/error');
})

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data= error.data;
    res.status(status).redirect('/error');
});





app.listen(4000);