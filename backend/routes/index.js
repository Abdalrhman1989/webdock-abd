const express = require('express');
const router = express.Router();
const postRoutes = require("./postRoutes");
const likesRoutes = require("./likesRoutes");
const userRoutes = require("./userRoutes");
const notificationRoutes = require("./notificationRoutes");
const commentRoutes = require("./commentRoutes");
require('dotenv').config();


// const middlewares = require('../Middlewares');
// const { userController, postController, notificationController, commentController} = require('../Controllers');

// middleware.authenticate er stadig tom
// router.use(middlewares.loggerMiddleware);

// Define routes

router.get('/', async (req,res) =>{
  try {
    res.send('Velkommen Abd. <br> gå til: <a href="http://localhost:3306/users">users </a> <br> gå til: <a href="http://localhost:3306/post">posts </a>');
  } catch (error) {
    res.status(500).send('kunne ikke hente eller finde data')
  }
});

router.use(postRoutes);
router.use(userRoutes);
router.use(notificationRoutes);
router.use(commentRoutes);
router.use(likesRoutes);


// router.get('/posts/:id', postController.getPostById);
// router.get('/post', postController.getAllPosts);
// router.post('/post', postController.createPost);

// middleware.authenticate er stadig tom
// router.get('/secure-users', middlewares.authenticationMiddleware, UserController.getSecureUsers);

// router.get('/users/:id', userController.getUserById);
// router.get('/users', userController.getAllUsers);

// SSO Login Route
// router.post('/login-sso', userController.loginUserWithSSO);

//todo: router.post('/users', UserController.createUser);
//todo: router.put('/users/:id', UserController.updateUser);
//todo: router.delete('/users/:id', UserController.deleteUser);

module.exports = router;
