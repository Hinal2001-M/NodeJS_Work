const comment = require('../models/comments');
const article = require('../models/article');

const addComment = async(req,res)=>{
    try{
        const {articleId,  ...comment} = req.body;
         const commentToSave = new Comment(comment);
        const savedComment = await commentToSave.save();
        await article.findOneAndUpdate(
            {_id: articleId},
            {$push: {comment: savedComment._id}}
        );
        res.status(200).send({
            status: 'success',
            message: 'comment created'
        })
    }catch(error){
        res.status(500).send({
            status: 'fail',
            message: error.message,
        });
    }
};

const getPostId = async(req,res) => {
    const articleId = req.params.articleId;
    try{
        const article = await article.findOne({_id: articleId}).populate(
            "comment"
        );
        res.status(200).send({
            status:"success",
            comment: article.comment,
        });
    }catch(error){
        res.status(500).send({
            status: 'fail',
            message: error.message
        });
    }
};

module.exports={
    addComment,
    getPostId
}