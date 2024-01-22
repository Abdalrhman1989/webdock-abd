import "/./src/styles/PostCard.scss";
import "/./src/styles/Roadmap.scss";
import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegCommentAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import UsersModal from "./UsersPopup";

const PostCard = ({
  postId,
  status,
  title,
  desc,
  date,
  likesCount,
  commentsCount,
  comments,
  userName,
  avatar,
  likedPost,
  likedByUsers,
  fromRoadMap,
  fromFeatureRequest,
  fromSearchResult,
  fromSinglePost,
  createdByUser
}) => {
  const statusClass = {
    Planned: "roadmapColumnPlannedDot",
    "In Progress": "roadmapColumnInProgressDot",
    Completed: "roadmapColumnCompletedDot",
  };


  const [liked, setLiked] = useState(false);
  const { id } = useParams();
  const [likesCountState, setLikesCountState] = useState(likesCount);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {

    fetch(
      `http://localhost:3306/like-status-for-post?postId=${postId}&userId=${localStorage.getItem(
        "loggedInUserId"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLiked(data.liked);
      })
      .catch((error) => {
        console.error("Error fetching like status:", error);
      });
  }, [id]);

  const handleShowLikedByUsers = () => {
    setShowUsers(!showUsers);
  }







  const handleLike = () => {
    // Toggle the like status and send a POST request to like/unlike the post
    setLiked(!liked);

    let count = likesCountState;
    if (liked) {
      count = count - 1;
      setLikesCountState(count);
    } else {
      count = count + 1;
      setLikesCountState(count);
    }



    fetch(`http://localhost:3306/post/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: localStorage.getItem("loggedInUserId"),
        postId: postId,
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

  return (
    <>
      <div className="CardBox">
        <div className="heartInfo">
          <div className="LikeFunc">
            {liked ? (
              <FaHeart onClick={handleLike} className="filledHeart" style={{ fontSize: `${(fromSearchResult || fromRoadMap) ? "15px" : ""}` }}  />
            ) : (
              <FaRegHeart onClick={handleLike} className="heart" style={{ fontSize: `${(fromSearchResult || fromRoadMap) ? "15px" : ""}` }}  />
            )}
            <p>{likedPost}</p>
            <p style={{ cursor: "pointer" }} onClick={handleShowLikedByUsers}>{likesCountState}</p>
          </div>



          <div className="InfoPart">

            <div>
              <h3>{title}</h3>
              <p><span className={statusClass[status]}></span> &nbsp; <span style={{ fontWeight: "bold" }}>{status}</span></p>
              {/* <b>
              {" "}
              <span className={statusClass[status]}></span>&nbsp;&nbsp; {status}
            </b> */}
              {fromSinglePost &&
                <div className="UserProfile">
                  <img
                    className="commentImg"
                    src={localStorage.getItem("avatar")}
                    alt="Profile Image"
                  />
                  <p style={{color : `${createdByUser?.role == "admin" ? "green" : ""}`}} className="userName">{userName}</p>
                </div>
              }
              <pre className="desc">{desc}</pre>
              {fromFeatureRequest &&

                <>
                  <span style={{ fontSize: "10px" }}>Created By : <span style={{color : `${createdByUser?.role == "admin" ? "green" : ""}`}}>{userName}</span>, Created At : {date}</span>
                </>

              }
              {
                fromSinglePost &&
                <i className="date">{date}</i>
              }
            </div>
          </div>
        </div>

        <div className="CommentNum">
          <FaRegCommentAlt style={{ fontSize: `${(fromSearchResult || fromRoadMap) ? "15px" : ""}` }} />
          <p>{commentsCount}</p>
        </div>
      </div>
      <UsersModal open={showUsers} setOpen={setShowUsers} users={likedByUsers ? likedByUsers : []} />
    </>
  );
};

export default PostCard;
