// PostList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PostList = ({ posts }) => (
  <div className="search-results">
    <ul>
      {posts.map((post) => (
        <li key={post.postID}>
          <Link to={`/post/${post.postID}`}>{post.title}</Link>
          {/* Render other post details here */}
        </li>
      ))}
    </ul>
  </div>
);

export default PostList;
