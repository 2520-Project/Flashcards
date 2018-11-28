require('dotenv').config()

/** Mongoclient module */
const MongoClient = require('mongodb').MongoClient;

/** mongodb database url */
const url = process.env.DB_API
const db_client = process.env.DB

/** Verifiys the that the inputted email and password are correct format and match the ones in the database. */
function login(email, password, callback) {
    readFile(email, (user) => {
        if(user === 'failed') {
            callback('failed')
        } else {
            if (password === user.password) {
                callback(user)
            } else {
                callback('failed')
            }
        }
    }); 
}

/** This add the user to the database */
function signup(username, email, password, callback) {
    if (email.indexOf('@') > 0 && email.indexOf('.') > 0 && (email.indexOf('com') > 0 || email.indexOf('ca') > 0) && (email.indexOf('com') > email.indexOf('@') || email.indexOf('ca') > email.indexOf('@')) && (password != "") && (username != "")) {
        var user = {
                    "username": username,
                    "email": email,
                    "password": password,
                    "lists":[]
                };
        addUserDB(user, "Users", (msg) => {
            if(msg === 'error') {
                callback('failed')
            } else {
                callback('success')
            }
        }); 
    } else {
        callback('failed')
    }
}

/** Connects to our mongo database and returns an active client and collection. */
function connectDB(callback) {
    MongoClient.connect(url, function(err, client) {
        if(err) {
            throw err;
        } else {
            var db = client.db(db_client)
            var collection = db.collection('Users')
            callback(collection, db, client)
        }
    });
}

/** Finds the list's index number in the data file and returns it. */
function getListIndex(list, data) {
    var lists = data.lists

    for (var i = 0; i < lists.length; i++) {
        if (lists[i].name === list) {
            return i
        }
    }
}

/** Finds the file associated with the email and returns it if it exists. If it does not exist it return the string 'failed' */
function readFile(email, callback){
    connectDB(function(collection, db, client) {
        collection.findOne({email: email}, function(err, user) {
            if (err) {
                throw err;
            } else if (!user) {
                callback('failed');
            } else {
                callback(user);
            }
            client.close();
        });
    });
}

/** Replaces the old database document with a new one. */
function updateDB(email, data) {
    connectDB((collection, db, client) => {
        collection.replaceOne({email: email}, data);
        client.close();
    });
}

/** Adds a new user document to the database and returns a callback either 'error' or 'success' */
function addUserDB(record, table, callback) {
    connectDB(function(collection, db, client) {
        db.collection(table).insertOne(record, function(err, res) {
            if (err){
                callback("error");
                throw err;
            } else {
                callback("success");
            }
            client.close();
        });
    });
}


/** Deletes a user document from the database and returns a callback with either 'error' or '1 document deleted' */
function deleteUserDB(record, table, callback) {
    connectDB(function(collection, db, client) {

        db.collection(table).deleteOne(record, function(err, res) {
            if (err){
                callback("error");
                throw err;
            } else {
                callback("success");
            }
            client.close();
        });
    });
}

/** Adds a new list to a users file and saves it to the database */
function addListDB(email, list, callback) {
    readFile(email, (user) => {
        user.lists.push(list);
        updateDB(email, user);
        callback('success')
    });
}

/** deletes a list from the users file and saves the change to the database */
function deleteListDB(email, list, callback) {
    readFile(email, (user) => {
        listIndex = getListIndex(list, user)
        user.lists.splice(listIndex, 1)
        updateDB(email, user)
        callback('success')
    })
}

module.exports = {
    login,
    signup,
    getListIndex,
    readFile,
    updateDB,
    addUserDB,
    deleteUserDB,
    addListDB,
    deleteListDB
}