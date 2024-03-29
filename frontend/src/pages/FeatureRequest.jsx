import React, { useState, useEffect } from 'react';
import '../styles/FeatureRequest.scss';
import PostCard from '../components/PostCard';
import { Link, useParams } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

const FeatureRequest = () => {

  
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All'); 
 
  

  useEffect(() => {

    fetch('http://localhost:3306/post')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.log('Error fetching data:', error));
  
  }, []); 

  

  useEffect(() => {

    fetch('http://localhost:3306/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log('Error fetching data:', error));
  
  }, []); 

  const user = posts && users.find(user => users.userID === posts.userID);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
    <h2>{filter}</h2>
    <div className='filter'>
      <label htmlFor="filter">Status</label>
      <select name="filter" id="filter" onChange={handleFilterChange}>
        <option value="All">All</option>
        <option value="Under Review">Under Review</option>
        <option value="Planned">Planned</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Closed">Closed</option>
      </select>
    </div>
    <div className='requests'>
    

        
    {posts.filter(item => filter === 'All' || item.status === filter) 
        .map((item) => {

            const user = users.find(user => user.id === item.userID);
            console.log("User", user);            
            return user && (
              <Link to={`/post/${item.id}`} key={item.id}>
                <PostCard
                  avatar={user.avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"}
                  key={item.id}
                  postId={item.id}
                  status={item.status}
                  title={item.title}
                  desc={item.description}
                  date={item.createdAt}
                  userName={user.name}
                  createdByUser={user}
                  likesCount={item.likesCount}
                  commentsCount={item.commentsCount}
                  likedByUsers={item.likedByUsers}
                  fromFeatureRequest={true}
                />
              </Link>
            );
        })}

      
    </div>   
    <button className='newRequest'>
      <Link to="/CreateRequest">New Request</Link>
    </button>
    
    </>
    
  ); 
};

export default FeatureRequest;
