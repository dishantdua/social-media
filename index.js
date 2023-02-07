const express = require('express');
const port = 8000;

const app = express();
const db = require("./config/mongoose")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passport-local')
const bodyParser = require('body-parser')
const flash = require('connect-flash');

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000, ()=>{
    console.log('chat server is listening on port 5000');
})

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('assets'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// setting up express session 
app.use(session({
    name: "SM-app",
    secret: "secretforSMAPP",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 60)
    },
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/SM_app' })

}))

app.use(flash());

// initializing passport 
app.use(passport.initialize());
app.use(passport.session()); 

app.use(passport.setAuthenticatedUser);

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
})

// Entry route for app
app.use('/', require('./routes/home'));


app.listen(port, (err)=>{
    if(err){
        console.log("ERROR", err);
        return;
    }

    console.log(`Server running at port ${port}`);
})