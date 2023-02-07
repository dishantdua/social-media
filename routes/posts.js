const express = require('express');
const Post = require('../models/post')
const User = require("../models/user")
const postController = require('../controllers/posts');
const passport = require('passport')
 
const router = express.Router();

const isAuthorized = async (req, res, next)=>{
    
    const post = await Post.findById(req.params.id).populate("user");
    if(post.user._id.toString() === req.user._id.toString()){
        req.post_to_be_updated = post;
        return next();
    }
    console.log("not authorized");
    res.redirect('/user/profile')
}
router.get('/create', passport.isAuthenticated, postController.post_get);
router.post('/create', passport.isAuthenticated, postController.create_post);

router.get('/:id',postController.show_post)

router.get('/:id/upvote', passport.isAuthenticated ,postController.upvote)
router.get('/:id/downvote', passport.isAuthenticated ,postController.downvote)

router.get('/:id/update', isAuthorized ,postController.update_post_get)
router.post('/:id/update', isAuthorized ,postController.update_post)
router.get('/:id/delete', isAuthorized ,postController.delete_post)



module.exports = router;