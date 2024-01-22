const { Like, Post, User, Notification } = require("../models");

const likesController = {
  likePost: async (req, res) => {
    const postID = req.params.postId;
  
    const userID = req.body.id;

    console.log(postID);
    console.log(userID);

    try {
      const post = await Post.findByPk(postID);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const existingLike = await Like.findOne({ where: { postID, userID } });

      if (existingLike) {
        await existingLike.destroy();
      
      } else {
        await Like.create({ postID, userID });
        // Optionally increment a likes count on the post


        if (post.userID != userID) {
          const user = await User.findByPk(userID);
          Notification.create({
            userID: post.userID,
            description: `${user.name} liked your post "${post.title}"`,
            postID: post.id,
            notificationType: "Post Liked",
            isSeen: false,
          });
        }
      }

      // Respond with the current like status
      const isLiked = !existingLike;
      res.status(200).json({ isLiked });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getLikeStatus: async (req, res) => {
    const { postId, userId } = req.query;

    try {
      const like = await Like.findOne({
        where: { postID: postId, userID: userId },
      });
      const liked = !!like;
      res.status(200).json({ liked });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getPostLikes: async (req, res) => {
    const postId = req.params.postId;

    try {
      const post = await Post.findByPk(postId, {
        include: [{ model: Like, include: [User] }],
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const likes = post.Likes || [];
      res.status(200).json({ likes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllPostLikes: async (req, res) => {
    try {
      const likes = await Like.findAll({
        include: [{ model: Post, include: [User] }],
      });

      console.log("Likes data:", likes);
      res.status(200).json({ likes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = likesController;
