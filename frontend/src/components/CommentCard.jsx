import React, { useEffect, useState } from "react";
import "/./src/styles/CommentCard.scss";
import {
  FaHeart,
  FaRegHeart,
  FaReply,
  FaEdit,
  FaArrowRight,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";

const CommentCard = ({
  id,
  userName,
  userId,
  likes,
  description,
  avatar,
  replies,
  users,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [replyToComment, setReplyToComment] = useState(false);
  const [toBeUpdated, setToBeUpdated] = useState(false);
  const [commentDescription, setCommentDescription] = useState(description);
  const [reply, setReply] = useState("");

  useEffect(() => {
    setLikesCount(likes.length);
    if (likes.findIndex((el) => el.commentID == id) > -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, []);

  const handleLikeComment = () => {
    let count = likesCount;
    if (liked) {
      count = count - 1;
      setLikesCount(count);
    } else {
      count = count + 1;
      setLikesCount(count);
    }

    setLiked(!liked);

    fetch(`http://localhost:3306/comments/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: localStorage.getItem("loggedInUserId"),
      }), // Updated property names
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response if needed
        console.log(data);
      })
      .catch((error) => {
        console.error("Error liking/unliking post:", error);
      });
  };

  const handleChangeReplyToComment = () => {
    setReplyToComment(!replyToComment);
  };

  const handleChangeCommentEdit = () => {
    setToBeUpdated(!toBeUpdated);
  };

  const handleSubmitReply = async () => {
    let replyData = {
      userID: localStorage.getItem("loggedInUserId"),
      parentCommentId: id,
      description: reply,
    };

    await axios.post("http://localhost:3306/comments", replyData);
    location.reload();
  };

  const handleSubmitEditedComment = async () => {
    let updationData = {
      description: commentDescription,
    };

    await axios.put(`http://localhost:3306/comments/${id}`, updationData);
    location.reload();
  };

  const handleDeleteComment = async () => {
    await axios.delete(`http://localhost:3306/comments/${id}`);
    location.reload();
  };

  return (
    <>
      <div className="commentCard">
        <div className="box">
          <div className="userInfo">
          <img 
                className="commentImg" 
                src={localStorage.getItem("avatar")} 
                alt="Profile Image" 
            />
            <div className="user">
              <h3> {userName} </h3>
            </div>
          </div>
          <div className="comment">
            {toBeUpdated ? (
              <>
                <form className="commentBox">
                  <img
                    className="commentImg"
                    src={localStorage.getItem("avatar")}
                    alt="Profile Image"
                  />
                  <input
                    className="commentInput"
                    type="text"
                    id="comment-input"
                    name="comment-input"
                    value={commentDescription}
                    onChange={(event) => {
                      setCommentDescription(event.target.value);
                    }}
                    placeholder="Write your reply"
                  />
                  <button onClick={handleSubmitEditedComment}>Save</button>
                </form>
              </>
            ) : (
              <>
                <p>{description}</p>
              </>
            )}
          </div>
          <div className="commentActions">
            <p>
              {" "}
              {!replyToComment && (
                <FaReply
                  style={{ cursor: "pointer" }}
                  onClick={handleChangeReplyToComment}
                />
              )}
              <span
                style={{ cursor: "pointer" }}
                onClick={handleChangeReplyToComment}
              >
                Reply{" "}
              </span>
              {replyToComment && (
                <form className="commentBox">
                  <img
                    className="commentImg"
                    src={localStorage.getItem("avatar")}
                    alt="Profile Image"
                  />
                  <input
                    className="commentInput"
                    type="text"
                    id="comment-input"
                    name="comment-input"
                    value={reply}
                    onChange={(event) => {
                      setReply(event.target.value);
                    }}
                    placeholder="Write your reply"
                  />
                  <button onClick={handleSubmitReply}>Reply</button>
                </form>
              )}
            </p>

            {localStorage.getItem("loggedInUserId") == userId && (
              <>
                <p style={{ cursor: "pointer" }}>
                  {" "}
                  <FaEdit onClick={handleChangeCommentEdit} /> Edit{" "}
                </p>
                <p style={{ cursor: "pointer" }} onClick={handleDeleteComment}>
                  <MdDeleteForever /> Delete{" "}
                </p>
              </>
            )}
            <div className="heart-button" onClick={handleLikeComment}>
              {liked ? (
                <FaHeart className="filledHeart" />
              ) : (
                <FaRegHeart className="heart" />
              )}
              <p>{likesCount}</p>
            </div>
          </div>
         <div className="commentRepliesSection">
  {replies.map((el, index) => {
    const replyingUser = users.find((user) => user.id === el.userID);
    return (
      
      <p key={index} className="reply">
        <span>{replyingUser ? replyingUser.name : "Unknown"}</span>
        : {el.description}
      </p>
    );
  })}
</div>
        </div>
      </div>
    </>
  );
};
export default CommentCard;
