import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message }); 
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage);
    } catch {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    // Check if the given id is valid or not
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with that id: ${id}`);
    } 

    const updatePost = { creator, title, message, tags, selectedFile, _id: id };
    await PostMessage.findByIdAndUpdate(id, updatePost, { new: true });

    res.json(updatePost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No Post with that id ${id}`);
    }

    await PostMessage.findByIdAndRemove(id);
    console.log('DELETE');
    
    res.json({ message: 'Post deleted successfully' });
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    
    if(!req.userId)
    return res.json({ message: 'Unauthenticated' });
    
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with that id ${id}`);
    }
    
    const post = await PostMessage.findById(id);
    
    const index = post.likes.findIndex((id) => id === String(req.userId));
    
    if(index === -1) {
        // like the post
        post.likes.push(req.userId);
    } else {
        // dislike a post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    console.log('LIKE');
    res.json(updatedPost);
}