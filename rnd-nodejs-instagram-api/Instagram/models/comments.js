const mongoose =require('mongoose');
const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    description: {type: String, max: 150},
});

module.exports = mongoose.model('comment',CommentSchema);