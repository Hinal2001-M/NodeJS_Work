const express = require('express');
require('./middleware/dbConnection');
require('dotenv').config();
const event = require('./models/event');

const app=express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/user', require('./routes/userRoute'));
app.use('/event', require('./routes/eventRoute'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});