const Comment = require('../models/Comment');
const { errorHandler } = require("../auth");


module.exports.addComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            content: req.body.content,
            author: req.user.id,
            postId: req.params.postId
        });
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate('author', 'username').sort({ createdAt: -1});
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (!req.user.isAdmin) return res.status(403).json({ message: 'Only admin can delete comments' });
        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};