import React, { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

const RoadmapColumn = ({ status, posts }) => {
  const statusClass = {
    Planned: "roadmapColumnPlannedDot",
    "In Progress": "roadmapColumnInProgressDot",
    Completed: "roadmapColumnCompletedDot",
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3306/users/`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log("Error fetching data:", error));
  }, []);

  const filteredPosts = posts.filter((item) => item.status === status);

  const addSpacesToAdjustStringLength = (description)=>{
    const spacesToBeAdded = 24-description.length;
    description = description+' '.repeat(spacesToBeAdded);
    return description;
  }

  const getDescription = (description)=>{
    if(description.length > 24){
      return `${description.slice(0, 20)} ...`;
    }
    else{
     return addSpacesToAdjustStringLength(description);
    }
  }

  return (
    <div>
      &nbsp;&nbsp;&nbsp;<span
        className={statusClass[status]}
      ></span>&nbsp;&nbsp;&nbsp;
      <h2 style={{ display: "inline-block" }}> {status}</h2>
    
      <div
        className="roadmapContent"
        style={{
          borderRadius: "20px",
        }}
      >
        {filteredPosts.map((item) => (
          <Link to={`/post/${item.id}`} key={item.id}>
            <PostCard
              key={item.id}
              postId={item.id}
              title={item.title?.length > 18 ? `${item.title?.slice(0, 18)} ...` :  item.title}
              desc={getDescription(item.description)}
              date={item.createdAt}
              likesCount={item.likesCount}
              commentsCount={item.commentsCount}
              likedByUsers={item.likedByUsers}
              fromRoadMap={true}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoadmapColumn;
