// Filename - demoApp/app.js
var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

const app = Express();
app.use(cors());

var ConnectionString="mongodb://localhost:27017/demoDB";

var dataBaseName="demoDB"
var database;
var dataCollection="demoCollection"

app.post("/post", (req,res)=>{
	console.log("Connected to React");
	res.redirect("/");

});

const PORT = process.env.PORT || 8080;

app.listen(PORT,
	console.log(`Server started on port ${PORT}`)
);


app.get('/api/demoApp/getNotes',(req,res)=>{
	database.collection("demoCollection").find({}).toArray((error,result)=>{
		response.send(result);
	});
})


// const app = Express();
// app.use(cors());

// var connectionString = "mongodb://127.0.0.1:27017/demoDB";
// var dataBaseName = "demoDB";
// var database;

// // Connect to the MongoDB server and initialize the database variable
// MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
//     if (err) {
//         console.error(err);
//         process.exit(1);
//     }
//     database = client.db(dataBaseName);
//     console.log("Connected to MongoDB");

//     // Start the server only after the database connection is established
//     const PORT = process.env.PORT || 8080;
//     app.listen(PORT, () => {
//         console.log(`Server started on port ${PORT}`);
//     });
// });

// app.post("/post", (req, res) => {
//     console.log("Connected to React");
//     res.redirect("/");
// });

// app.get('/api/demoApp/getNotes', (req, res) => {
//     database.collection("demoCollection").find({}).toArray((error, result) => {
//         if (error) {
//             res.status(500).send(error);
//         } else {
//             res.send(result);
//         }
//     });
// });