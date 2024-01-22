import React, { useState, useEffect } from "react";
import "/./src/styles/Roadmap.scss";
import RoadmapColumn from "../components/Roadmapcolumn";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";

const Roadmap = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch data fra backend API
    fetch("http://localhost:3306/post")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.log("Error fetching data:", error));
  }, []);

  useEffect(() => {
    // Fetch the likes when the component mounts
    fetch(`http://localhost:3306/like/post-likes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Update the likes count in the state
        setLikesCount(data.likes.length);
      })
      .catch((error) => {
        console.error("Error fetching post likes:", error);
      });
  }, []);

  return (
    <>
<Grid container spacing={2}>
          <Grid item md={4}>
          <RoadmapColumn status="Planned" posts={posts} />
          </Grid>
          <Grid item md={4}>
          <RoadmapColumn status="In Progress" posts={posts} />
          </Grid>
          <Grid item md={4}>
          <RoadmapColumn status="Completed" posts={posts} />
          </Grid>
        </Grid>
      {/* <div className="roadmap">
                    

        <RoadmapColumn status="Planned" posts={posts} />
        <RoadmapColumn status="In Progress" posts={posts} />
        <RoadmapColumn status="Completed" posts={posts} />
      </div> */}
      <button className="newRequest">
        <Link to="/CreateRequest">New Request</Link>
      </button>
    </>
  );
};

export default Roadmap;
