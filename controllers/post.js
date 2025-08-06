const Post = require('../models/Post');
const { errorHandler } = require("../auth");


module.exports.createPost = async (req, res) => {
    try {
        const post = await Post.create({ ...req.body, author: req.user.id });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
        Object.assign(post, req.body);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user.id && !req.user.isAdmin) return res.status(403).json({ message: 'Unauthorized' });
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};