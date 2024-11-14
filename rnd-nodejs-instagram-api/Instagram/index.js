const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const userRoute = require('./routes/user-route');
const articleRoute = require('./routes/article-route');
const commentRoute = require('./routes/comment-route');
const PORT = 8000
const app = express();
//connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('api/article', articleRoute);
app.use('api/user', userRoute);
app.use('api/comment', commentRoute);

app.use('/', (req, res) => {
    res.send(`${req.method} Route ${req.path} not found !`);
});
app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
});
