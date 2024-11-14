const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'reactDemo',
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// mongoose.connect('mongodb://localhost:27017/',{
//     dbName: 'reactDemo',
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// },err => err? console.log(err):
//     console.log('Connected to MongoDB')
// );

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    email:{
        type: String,
        require:true,
        unique:true
    },
    date:{
        type: Date,
        require:true,
        default:Date.now
    }
});

const User = mongoose.model('users',userSchema)
User.createIndexes();



// for backend and express
const express = require('express');
const app = express();
const cors = require('cors');
console.log("App listen at port 8080");
app.use(express.json());
app.use(cors());
app.get("/", (req,res)=>{
    res.send("App is Working");
    // You can check backend is working or not by 
    // entering http://loacalhost:5000
     
    // If you see App is working means
    // backend working properly
});

app.post("/register",async(req,res)=>{
    try{
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if(result){
            delete result.password;
            res.send(req.body);
            console.log(result);
        }else{
            
            console.log("User already Exist")
        }
        }catch (e) {
            res.send("Something went Wrong");
        }
    }
);
app.listen(8080);
