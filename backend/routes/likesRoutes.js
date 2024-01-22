// likesRoutes.js
const express = require('express');
const router = express.Router();
const likesController = require('../Controllers/LikesController');

router.get('/like-status-for-post', likesController.getLikeStatus); 
router.post('/post/:postId/like', likesController.likePost);
router.get('/post/:postId/likes', likesController.getPostLikes); 
router.get('/likes', likesController.getAllPostLikes); 

module.exports = router;
