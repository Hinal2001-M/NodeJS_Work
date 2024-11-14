var mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false)

mongoose.connect('mongodb://127.0.0.1/mongoDB_test', (err) => {
    if (!err) {
        console.log('MongoDB connection succeeded.');
    }
    else {
        console.log('Error in DB connection : ' + err);
    }
});

