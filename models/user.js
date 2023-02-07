const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name : {
        type: String,
        required: true
    }, 
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    following:[
        {
            id: mongoose.Schema.Types.ObjectId,
            userId: String,
        }
    ],
    followers:[
        {
            id: mongoose.Schema.Types.ObjectId,
            userId: String,
        }
    ],
    
},{
    timestamps: true
});

// userSchema.index({ _id: 1 }, { sparse: true });rs


const User = mongoose.model("User", userSchema);
module.exports = User;