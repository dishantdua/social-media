const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types

const User = require('../models/user')
const Post = require('../models/post')


module.exports.profile = async(req, res)=>{
    const user = await User.findById(req.user._id).populate('posts');

    for(var post of user.posts){
        post.upvoted = false;
        for(u of post.upvotes){
            if(u._id.toString() === req.user._id.toString()){
                post.upvoted = true
                break;
            }
        }
        post.downvoted = false;
        for(u of post.downvotes){
            if(u._id.toString() === req.user._id.toString()){
                post.downvoted = true;
                break;
            }
        }
    }
    await user.save();

    res.render("profile" , {user, stalking: false, show:"posts"})
}


module.exports.stalk_user = async(req, res)=>{

    if(req.params.id === req.user._id.toString()){
        return res.redirect('/user/profile')
    }

    try{
        const user = await User.findById(req.params.id).populate('posts');
        
        let following = false; 
        if(user){
            for(let follower of user.followers){
                if(follower.userId === req.user._id.toString()){
                    following = true
                }
            }

            for(var post of user.posts){
                post.upvoted = false;
                for(u of post.upvotes){
                    if(u._id.toString() === req.user._id.toString()){
                        post.upvoted = true
                        break;
                    }
                }
                post.downvoted = false;
                for(u of post.downvotes){
                    if(u._id.toString() === req.user._id.toString()){
                        post.downvoted = true;
                        break;
                    }
                }
            }
            await user.save();
            res.render('profile', {user, stalking: true, following, show: "posts"})
        } else{
            throw "No such User"
        }
    } catch(e){
        console.log(e);
        req.flash('error', 'User not found');
        res.redirect('/user/profile');
    }
}

module.exports.follow = async (req, res)=>{

    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if(user && currentUser){
        let following = false;
        for(follower of user.followers){
            if(follower.userId === currentUser._id.toString()){
                following = true
            }
        }

        if (!following) {
            await user.updateOne({ $push: 
                { 
                    followers: {
                        userId: req.user._id.toString(),
                        _id: new ObjectId()
                    } 
                } 
            });
            await currentUser.updateOne({ $push: 
                { 
                    following: {
                        userId: req.params.id,
                        _id: new ObjectId()
                    } 
                } 
            });
        } 

        req.flash('success', `Started following ${user.username}`);
        res.redirect('back')
    } else{
        req.flash('error', "No such user");
        res.redirect('back');
    }

}
module.exports.unfollow = async (req, res)=>{

    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if(user && currentUser){
        let following = false;
        for(follower of user.followers){
            if(follower.userId === currentUser._id.toString()){
                following = true
            }
        }

        if (following) {
            await user.updateOne({ $pull: 
                { 
                    followers: {
                        userId: req.user._id.toString(),
                    } 
                } 
            });
            await currentUser.updateOne({ $pull: 
                { 
                    following: {
                        userId: req.params.id,
                    } 
                } 
            });
        } 
        req.flash('success', `Unfollowed ${user.username}`)
        res.redirect('back')
    } else{
        req.flash('error', "No such user");
        res.redirect('back');
    }
}

module.exports.search = async (req, res)=>{
    
    const user = await User.findOne({username: req.body.username});

    if(user){      
        res.redirect(`/user/${user._id}`)
    } else{
        req.flash('error', "User not found")
        res.redirect('back')
    }
}

module.exports.signin_get = (req, res) => {
    if(req.isAuthenticated()){
        req.flash('info', 'Already Logged in')
        return res.redirect('/user/profile')
    }
    res.render('signin', {user: null});
}

module.exports.login_post = (req, res)=>{
    req.flash('success', `Welcome, ${req.user.username}`)
    res.redirect('/user/profile')
}

module.exports.signup_post = async (req, res) =>{

    let user = await User.findOne({username: req.body.username});
    if(!user){
        try{
            user = await new User(req.body);
            user.followers = [{
                userId: user._id.toString(),
                _id: new ObjectId()
            }];
            user.following = [{
                userId: user._id.toString(),
                _id: new ObjectId()
            }];
            await user.save();
        
            req.flash('success', "Successfully created your account")
            req.login(user, (err)=>{
                if(err) {
                    req.flash('error', err)
                    return res.redirect('/user/signin');
                }
                
                res.redirect('/user/profile');
            });
        }catch(e){
            console.log(e);
            req.flash("error", "Error in creating new user")
            res.redirect('back');
        }
    } else{
        req.flash("error", "Username already used");
        res.redirect('back');
    }
}

module.exports.logout = (req, res)=>{
    try {
        req.logout();
        req.flash('info', "Logged you out")
        res.redirect('/user/signin')
    } catch (error) {
        console.log(error);
        req.flash('error', 'An error occured');
        res.redirect('back');
    }
    
}

module.exports.profile_followers = async (req, res)=>{

    let id = req.user._id;
    let stalking = false;
    if(req.params.id){
        id = req.params.id
        stalking = true;
    }
    const user = await User.findById(id);
    let following = false;
    if(stalking){
        for(let follower of user.followers){
            if(follower.userId === req.user._id.toString()){
                following = true
            }
        }
    }

    let followers_array = [];
    for(follower of user.followers){
        followers_array.push(follower.userId)
    }

    const followers = await User.find({
        _id: {
            $in: followers_array
        }
    })
    res.render("profile" , {user, stalking, following, followers, show:"followers"})

}
module.exports.profile_following = async (req, res)=>{

    let id = req.user._id;
    let stalking = false;
    if(req.params.id){
        id = req.params.id;
        stalking = true
    }
    const user = await User.findById(id);
    let following = false;
    if(stalking){
        for(let follower of user.followers){
            if(follower.userId === req.user._id.toString()){
                following = true
            }
        }
    }

    let following_array = [];
    for(f of user.following){
        following_array.push(f.userId)
    }

    const followings = await User.find({
        _id: {
            $in: following_array
        }
    })
    res.render("profile" , {user, stalking, following, followings, show:"following"})
}

module.exports.chat = (req, res)=>{
    res.render('chatbox');
}