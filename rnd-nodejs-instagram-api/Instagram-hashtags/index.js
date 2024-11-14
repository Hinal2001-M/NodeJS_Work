require('dotenv').config();
const app = require('express')();
const axios = require('axios');

app.get('/instagram/:query', function (req,res){
    const query = req.params.query
    axios.get('https://www.instagram.com/explore/tags/' + query + '/?__a=1')
    .then((response)=>{
        res.send(response.data)
    })
    .catch((err)=>{
        console.error(err)
        res.status(500).send('An error occurred, please try again later.')
    })
})



app.listen(3000,function (){
    console.log('server start');
})
