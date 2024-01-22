import React from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

const SearchResults = ({ searchResults }) => {

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
    <div className="search-results">
      {searchResults.map((post) => (
        <div key={post.id}>
          <Link to={`/post/${post.id}`}>
            <PostCard
              postId={post.id}
              title={post.title?.length > 18 ? `${post.title?.slice(0, 18)} ...` :  post.title}
              desc={getDescription(post.description)}
              date={post.date}
              likesCount={post.likesCount}
              commentsCount={post.commentsCount}
              userName={post.userName}
              avatar={post.avatar}
              status={post.status}
              likedByUsers={post.likedByUsers}
              fromSearchResult={true}
            />
            
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
