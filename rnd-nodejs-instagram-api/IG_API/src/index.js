const express = require("express");
const cors = require("cors");
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const app = express();

const server = new ApolloServer({typeDefs,resolvers});
server.start().then(()=>{
    return server.applyMiddleware({app})
})

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

app.get("/get-auth-code", (req, res, next) => {
  return res.send(
    `<a href='https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_media,user_profile&response_type=code'> Connect to Instagram </a>`
  );
});

// start server on the PORT.
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));