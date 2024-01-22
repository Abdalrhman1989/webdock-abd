const { Sequelize } = require("sequelize");
const { Post, User, Like, Comment } = require("../models");
const { Op } = require("sequelize");
const https = require("https");

const postController = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.findAll();

      for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        let likedByUsersIds = [];
        let likesArr = await Like.findAll({
          where: {
            postID: post.id,
            commentID: null,
          },
          attributes : ['userID']
        });
        likedByUsersIds = likesArr.map((el)=>{
          return el.userID
        });
        let likedByUsers = await User.findAll({
          where : {
            id : {
              [Op.in] : likedByUsersIds
            }
          }
        });
        posts[i].dataValues.likesCount = likedByUsersIds.length;
        posts[i].dataValues.likedByUsers = likedByUsers;
        let commentsCount = await Comment.count({
          where: {
            postID: post.id,
          },
        });
        posts[i].dataValues.commentsCount = commentsCount;
      }
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getPostById: async (req, res) => {
    try {
      console.log("Requested Post ID:", req.params.id);
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      let likedByUsersIds = [];
      let likesArr = await Like.findAll({
        where: {
          postID: post.id,
          commentID: null,
        },
        attributes : ['userID']
      });
      likedByUsersIds = likesArr.map((el)=>{
        return el.userID
      });
      let likedByUsers = await User.findAll({
        where : {
          id : {
            [Op.in] : likedByUsersIds
          }
        }
      });
      post.dataValues.likesCount = likedByUsersIds.length;
      post.dataValues.likedByUsers = likedByUsers;
      let commentsCount = await Comment.count({
        where: {
          postID: post.id,
        },
      });
      post.dataValues.commentsCount = commentsCount;
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  createPost: async (req, res) => {
    try {
      
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        res.status(404).send("User Not Found");
      }
      const post = await Post.create({
        userID: user.id,
        status: "Under Review",
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tags,
        image: req.body.image,
      });

     

      const postmark = require("postmark");
      const client = new postmark.ServerClient(process.env.EMAIL_KEY);
      await client.sendEmail({
        From: "uclfeedback@webdock.io",
        To: "abdalrhmanaldarra@gmail.com",
        Subject: "Webdock New Feature Request",
        // TextBody: textBody,
        TextBody: req.body.description,
      });

      const data = JSON.stringify({
        // userID: req.body.id,
        userID: user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      });

      const options = {
        // jeg har her indsat detaljerne for http requesten
        hostname: "webdock.io",
        port: 443,
        path: "/en/platform_data/feature_requests/new",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
        },
      };

      const request = https.request(options, (response) => {
        //Http funktion, hvor det andet argument er et callback som kommer når et response er der
        let data = "";

        response.on("data", (chunk) => {
          //eventlistener response på data, når en chunk af resonse body er modtaget.
          data += chunk;
        });

        response.on("end", () => {
          // end burde gerne være her at hele responset er modtaget, hvorefter jeg har console logget status code og body
          console.log("Response status code:", response.statusCode);
          console.log("Response body:", data);

          if (response.statusCode === 200) {
            res.status(200).json(JSON.parse(data));
          } else {
            console.error("Error posting data to endpoint");
            res.status(500).send("Error posting data to endpoint");
          }
        });
      });

      request.on("error", (error) => {
        console.error(error);
        res.status(500).send("Internal Server Error");
      });

      request.write(data); //skriver hvad der var i dataen
      request.end(); //indikerer at den request er slut
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  //Post Update controller
  updatePost: async (req, res) => {
    try {
      const postId = req.params.id;

      // Check if the post exists
      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).send("Post not found");
      }

      await post.update({
        status: req.body.status ? req.body.status : post.status,
        title: req.body.title,
        description: req.body.description,
      });

      res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },


  getPostByQuery: async (req, res) => {
    try {
      const { query } = req.query;
      console.log("Search Query:", query);

      if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
      }

      const posts = await Post.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } }, 
            { description: { [Op.like]: `%${query}%` } }, 
            { tag: { [Op.like]: `%${query}%` } }, 
          ],
        },
      });

      for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        let likedByUsersIds = [];
        let likesArr = await Like.findAll({
          where: {
            postID: post.id,
            commentID: null,
          },
          attributes : ['userID']
        });
        likedByUsersIds = likesArr.map((el)=>{
          return el.userID
        });
        let likedByUsers = await User.findAll({
          where : {
            id : {
              [Op.in] : likedByUsersIds
            }
          }
        });
        
        posts[i].dataValues.likesCount = likedByUsersIds.length; 
        posts[i].dataValues.likedByUsers = likedByUsers;
        let commentsCount = await Comment.count({
          where: {
            postID: post.id,
          },
        });
        posts[i].dataValues.commentsCount = commentsCount;
      }


      console.log("Found Posts:", posts);

      if (posts.length === 0) {
        return res.status(404).json({ error: "No matching posts found" });
      }

      // Return the search results
      res.json({ searchResults: posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.destroy({
        where: {
          id: req.params.id,
        },
      });

      if (post) {
        res.json({ message: "Post deleted successfully", deletedCount: post });
      } else {
        res.json({ message: "Post not found" });
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "An error occurred", error: error.message }); // hvad går gaaaaaaalt her
    }
  },
};

module.exports = postController;

