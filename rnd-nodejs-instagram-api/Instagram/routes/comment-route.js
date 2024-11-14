const router = require("express").Router();
const authController = require('../controllers/auth-controller');
const commentController = require('../controllers/comment-controller');

router.post("/", authController.verify, commentController.addComment);
router.get("/:ArticleId", commentController.getPostId);

module.exports = router;
