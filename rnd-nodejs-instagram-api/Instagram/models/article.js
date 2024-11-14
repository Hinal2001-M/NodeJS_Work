const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
    description:{ type:String, max:500},
    imgurl: {type: String},
    likes: [{type:  mongoose.Schema.Types.ObjectId, ref:'user'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:'user'}]
})

module.exports = mongoose.model('article',articleSchema);