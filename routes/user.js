const express = require('express');
const passport = require('passport');
const userController = require('../controllers/user');
 
const router = express.Router();

router.get('/profile', passport.isAuthenticated ,userController.profile);
router.get('/profile/followers', passport.isAuthenticated ,userController.profile_followers);
router.get('/profile/following', passport.isAuthenticated ,userController.profile_following);

router.get('/signin', userController.signin_get);
router.post('/signup', userController.signup_post);

router.post('/login', passport.authenticate(
    'local',
    {
        failureRedirect: '/user/signin'
    }
),userController.login_post)

router.post('/search', passport.isAuthenticated, userController.search);

router.get('/logout',passport.isAuthenticated, userController.logout);
router.get('/chat', passport.isAuthenticated, userController.chat);

router.get('/:id', passport.isAuthenticated, userController.stalk_user);
router.get('/:id/follow', passport.isAuthenticated, userController.follow);
router.get('/:id/unfollow', passport.isAuthenticated, userController.unfollow);

router.get('/:id/followers', passport.isAuthenticated ,userController.profile_followers);
router.get('/:id/following', passport.isAuthenticated ,userController.profile_following);



module.exports = router;
