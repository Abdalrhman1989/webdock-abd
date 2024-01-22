import React, { useState, useEffect } from "react";
import "/./src/styles/CommentCard.scss";
import {
  FaHeart,
  FaRegHeart,
  FaReply,
  FaEdit,
  FaArrowRight,
  MdDeleteForever,
} from "react-icons/fa";
import axios from "axios";

const ReplyCommentCard = ({
  id,
  userName,
  userId,
  likes,
  description,
  avatar,
  users,
  commentId,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [toBeUpdated, setToBeUpdated] = useState(false);
  const [replyDescription, setReplyDescription] = useState(description);

  useEffect(() => {
    setLikesCount(likes.length);
    if (likes.findIndex((el) => el.commentID === id) > -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes, id]);

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

    axios
      .post(`http://localhost:3306/comments/${id}/like`, {
        id: localStorage.getItem("loggedInUserId"),
      })
      .then((response) => {
        // Handle the response if needed
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error liking/unliking comment:", error);
      });
  };

  const handleChangeCommentEdit = () => {
    setToBeUpdated(!toBeUpdated);
  };

  const handleSubmitEditedComment = async () => {
    let updationData = {
      description: replyDescription,
    };

    await axios.put(`http://localhost:3306/comments/${id}`, updationData);
  
    window.location.reload();
  };

  const handleDeleteComment = async () => {
    await axios.delete(`http://localhost:3306/comments/${id}`);
    
    window.location.reload();
  };

  return (
    <>
      <div className="commentCard">
        <div className="box">
          <div className="userInfo">
            <img src={avatar} alt="Profile Image" loading="lazy" />
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
                    value={replyDescription}
                    onChange={(event) => {
                      setReplyDescription(event.target.value);
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
            {localStorage.getItem("loggedInUserId") === userId && (
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
        </div>
      </div>
    </>
  );
};

export default ReplyCommentCard;
