const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const auth = require("../auth");
const { verify, verifyAdmin } = require('../auth');

router.get('/:postId', commentController.getCommentsByPost);
router.post('/:postId', verify, commentController.addComment);
router.delete('/:commentId', verify, verifyAdmin, commentController.deleteComment);

module.exports = router;