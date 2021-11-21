import mongoose from "mongoose";

// creating a schema 
const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likeCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
});

// creating a model using schema we created previously
const PostMessage = mongoose.model('Post Message', postSchema);

// exporting mongoose model 
export default PostMessage;