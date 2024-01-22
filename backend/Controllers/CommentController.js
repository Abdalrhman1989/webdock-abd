const { Comment, Like, Notification, User } = require("../models");

const commentController = {
  getAllComments: async (req, res) => {
    try {
      let comments = await Comment.findAll();
      for (let i = 0; i < comments.length; i++) {
        let likes = await Like.findAll({
          where: {
            commentID: comments[i].id,
          },
        });
        comments[i].dataValues.likes = likes;
      }
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getCommentById: async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },




  createComment: async (req, res) => {
    try {
      let { parentCommentId } = req.body;

      let comment = null;
      if (parentCommentId) {
        comment = await Comment.findOne({
          where: {
            id: parentCommentId,
          },
        });
        const user = await User.findByPk(req.body.userID);
        if (comment.userID != req.body.userID) {
          Notification.create({
            userID: comment.userID,
            description: `${user.name} replied on your comment "${comment.description}"`,
            commentID: comment.id,
            notificationType: "Comment Reply",
            isSeen: false,
          });
        }

        // Send notifications to all users who previously replied on this comment ...
        let commentReplies = await Comment.findAll({
          where: {
            parentCommentId: parentCommentId,
          },
        });
        for (let i = 0; i < commentReplies.length; i++) {
          if (commentReplies[i].userID != req.body.userID) {
            // Send notification to this user ...
            Notification.create({
              userID: commentReplies[i].userID,
              description: `${user.name} also replied on the comment "${comment.description}"`,
              commentID: comment.id,
              notificationType: "Comment Reply",
              isSeen: false,
            });
          }
        }
      }

      comment = await Comment.create({
        description: req.body.description,
        userID: req.body.userID,
        postID: req.body.postID ? req.body.postID : comment.postID,
        parentCommentId: parentCommentId,
        likedComment: 0,
        commentLikedAmount: 0,
      });

      res.status(201).json(comment);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Sever Error");
    }
  },
  updateComment: async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }

      // i want to update the description
      comment.description = req.body.description;
      await comment.save();

      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }

      // Deleting related replies first ...
      await Comment.destroy({
        where: {
          parentCommentId: req.params.id,
        },
      });

      await comment.destroy();

      res.status(204).send(); 
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  likeComment: async (req, res) => {
    const commentId = req.params.id;
    const userID = req.body.id;

    try {
      // Find the comment by ID
      const comment = await Comment.findByPk(commentId);

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      let liked = await Like.findOne({
        where: {
          userID: userID,
          commentID: commentId,
        },
      });

      if (liked) {
        await liked.destroy();
      } else {
        await Like.create({
          userID: userID,
          commentID: commentId,
          postID: comment.postID,
        });

        if (comment.userID != userID) {
          const user = await User.findByPk(userID);
          Notification.create({
            userID: comment.userID,
            description: `${user.name} liked your comment "${comment.description}"`,
            commentID: comment.id,
            notificationType: "Comment Liked",
            isSeen: false,
          });
        }
      }

      res.status(200).json({
        message: "Comment liked/unliked successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = commentController;
