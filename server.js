console.log('Starting Flashcards application...');

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
var request = require('request');
const session = require('client-sessions');

const port = process.env.PORT || 8080;

var app = express();

var getDB = require('./connect.js');

// handlebars setup
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

// bodyparser setup
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(bodyParser.json())

// creates a session
app.use(session({
    cookieName: 'session',
    secret: 'i_cant_tell_you',
    duration: 1 * 60 * 60 * 1000,
    activeDuration: 1 * 30 * 60 * 1000
}));

/** Checks to see if the session is still active, if it isnt it redirects to '/' */
function sessionCheck(req, res, next) {
    if (req.session && req.session.user) {
        next()
    } else {
        res.redirect('/')
    }
}

/**
 * sends the username and password to the DB for validation, if true it redirects to the homepage, 
 * else it renders the login page with a error message
 */
app.post('/login', function(req, res) {
    getDB.login(req.body.email, req.body.password, (user) => {
        if (user === 'failed') {
            res.render('log.hbs', {
                error: 'Wrong email or password'
            });
        } else {
            req.session.user = user
            res.redirect('/home')
        }
    });
});

/**
 * sends the signup data to the DB for validation, if true it redirects to the homepage, 
 * else it renders the signup page again
 */
app.post('/signup', function (req, res) {
    getDB.signup(req.body.username, req.body.email, req.body.password, (msg) => {
        if (msg === 'failed') {
            // res.render('signup.hbs')
        } else {
            req.session.msg = msg
            res.redirect('/')
        }
    });
});

app.get('/', (request, response) => {
    response.render('log.hbs')
});

/**
 * renders the signup page
 */
app.get('/signup', (request, response) => {
    response.render('log.hbs')
});

/**
 * This takes the username and go to the home page at home.hbs
 */
app.get('/home', sessionCheck, (req, res) => {
    getDB.readFile(req.session.user.email, (user) => {
        req.session.user = user
        res.render('home.hbs', {
            username: req.session.user.username,
            lists: req.session.user.lists
        });
    });
});

/**
 * sends the new lists name to the DB to add it. if it returns true then the function sends a response to the webpage.
 */
app.post('/addList', (req, res) => {
    var email = req.session.user.email
    var list = req.body
    getDB.addListDB(email, list, (msg) => {
        if (msg === 'success') {
            res.send('ok')
        }
    });
});

/**
 * sends a the lists name to the DB to delete it. if it returns true then the function sends a response to the webpage.
 */
app.post('/deleteList', (req, res) => {
    var email = req.session.user.email
    var list = req.body.list
    getDB.deleteListDB(email, list, (msg) => {
        if (msg === 'success') {
            res.send('ok')
        }
    })
});

app.post('/flashCards', sessionCheck, (req, res) => {
    getDB.readFile(req.session.user.email, (user) => {
        req.session.user = user
        req.session.user.currentList = req.body.radioList
        listIndex = getDB.getListIndex(req.body.radioList, req.session.user)
        res.render('flashcards.hbs', {
            list: req.session.user.lists[listIndex]
        });
    });
});

app.post('/addCard', (req, res) => {
    var email = req.session.user.email
    var question = req.body.question
    var answer = req.body.answer
    var list = req.session.user.currentList
    getDB.addCardDB(email, list, question, answer, (msg) => {
        if (msg === 'success') {
            res.send('ok')
        }
    });
});

app.post('/deleteCard', (req, res) => {
    var email = req.session.user.email
    var question = req.body.currentQuestion
    var answer = req.body.currentAnswer
    var list = req.session.user.currentList
    getDB.deleteCardDB(email, list, question, answer, (msg) => {
        if (msg === 'success') {
            res.send('ok')
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});