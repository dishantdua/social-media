const express = require('express');
const homeController = require('../controllers/home');
 
const router = express.Router();

router.get('/', homeController.homeGet);

router.use('/user', require('./user'));
router.use('/posts', require('./posts'));

module.exports = router;