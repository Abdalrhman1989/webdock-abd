import React, { useState, useEffect } from "react";
import "/./src/styles/PostCard.scss";
import "/./src/styles/globals.scss";

import CreateComment from "../components/CreateComment";
import CommentCard from "../components/CommentCard";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import BasicModal from "../components/Popup";
import { BeatLoader } from "react-spinners";



const Post = () => {
  //loading useStates til loading
  const [postLoading, setPostLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const { id } = useParams("post/");

  useEffect(() => {
    setPostLoading(true);
    fetch(`http://localhost:3306/post/${id}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.log("Error fetching data:", error));
    setPostLoading(false);
  }, []);

  useEffect(() => {
    setUsersLoading(true);
    fetch(`http://localhost:3306/users/`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log("Error fetching data:", error));
    setUsersLoading(false);
  }, []);

  useEffect(() => {
    setCommentsLoading(true);
    fetch(`http://localhost:3306/comments/`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.log("Error fetching data:", error));
    setCommentsLoading(false);
  }, []);

  const user = post && users.find((user) => user.id === post.userID);
  const loggedInUser = users.find(
    (user) => user.email === localStorage.getItem("email")
  );
  const isAdmin = loggedInUser && loggedInUser.role === "admin";
  const isLoggedIn = Boolean(localStorage.getItem("ssoToken"));

  return (
    <>
    
      {isAdmin && isLoggedIn && post ? (
        <BasicModal
          id={post.id}
          title={post.title}
          description={post.description}
        />
      ) : (
        <></>
      )}
      {postLoading || usersLoading || commentsLoading ? (
        <BeatLoader color="#018647" />
      ) : (
        <>
          {post && user && (
            <PostCard
              userName={user ? user.name : "Unknown User"}
              createdByUser={user}
              userID={post.userID}
              postId={post.id}
              avatar={
                user.avatarUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
              }
              status={post.status}
              title={post.title}
              desc={post.description}
              date={post.createdAt}
              likesCount={post.likesCount}
              commentsCount={post.commentsCount}
              isSinglePage={true}
              likedByUsers={post.likedByUsers}
              fromSinglePost={true}
            />
          
          )}
          {isLoggedIn ? (
            <CreateComment />
          ) : (
            <p className="loggedOutText">Log in to comment on this post</p>
          )}
          {comments.length > 0 &&
            user &&
            comments
              .filter(
                (comment) =>
                  post && comment.postID === post.id && !comment.parentCommentId
              )
              .map((comment) => {
                const commentUser = users.find(
                  (user) => user.id === comment.userID
                );
                return (
                  <CommentCard
                    avatar={
                      user.avatarUrl ||
                      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                    }
                    key={comment.id}
                    id={comment.id}
                    userName={commentUser ? commentUser.name : "Unknown User"}
                    userId={commentUser?.id}
                    likes={comment.likes}
                    description={comment.description}
                    replies={comments.filter((el) => {
                      return el.parentCommentId == comment.id;
                    })}
                    users={users}
                  />
                );
              })}
        </>
      
      )}
    </>
  );
};

export default Post;
