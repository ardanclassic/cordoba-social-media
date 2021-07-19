import React from "react";
import PostHeader from "components/POST_GROUP/PostHeader";
import PostContent from "components/POST_GROUP/PostContent";
import Reaction from "components/POST_GROUP/Reaction";
import "./style.scss";

const PostParent = ({datapost}) => {
  const { post, user, currentUser } = datapost;
  
  return (
    <div key={post.contentID} className="contents">
      <PostHeader dataHeader={{ post, user, currentUser }} />
      <PostContent dataContent={{ post, user, currentUser }} />
      <Reaction dataReaction={{ post, user, currentUser }} />
    </div>
  )
}

export default PostParent
