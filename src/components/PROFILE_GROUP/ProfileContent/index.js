import React, { useState, useEffect } from "react";
import { useUserContext } from "contexts/UserContext";
import StatusPost from "components/POST_GROUP/StatusPost";
import PostParent from "components/POST_GROUP/index";
import { Spinner } from "reactstrap";
import moment from "moment";
import "./style.scss";

const ProfileContent = ({ content }) => {
  const { getUserPostContent } = useUserContext();
  const { currentUser, thisUser } = content;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (thisUser) {
      getUserPostContent(thisUser).then((collect) => {
        collect.onSnapshot((snap) => {
          const contents = [];
          snap.forEach((doc) => {
            const dataContent = {
              ...doc.data(),
              hoursDuration: moment().diff(
                moment(doc.data().created_at),
                "hours"
              ),
              daysDuration: moment().diff(
                moment(doc.data().created_at),
                "days"
              ),
              updated_at: moment(doc.data().created_at).format("LL"),
              timeFormat: moment(doc.data().created_at).format("hh:mm A"),
              fromNow: moment(doc.data().created_at).fromNow(),
            };
            contents.push(dataContent);
          });
          const sortedContents = contents.sort(
            (a, b) => b.created_at - a.created_at
          );
          if (contents.length > 0) {
            if (isMounted) {
              setPosts(sortedContents);
              setLoading(false);
            }
          } else {
            if (isMounted) {
              setPosts([]);
              setLoading(false);
            }
          }
        });
      });
    }
    return () => (isMounted = false);
  }, [thisUser, getUserPostContent]);

  const GetContent = () => {
    if (loading) {
      return (
        <div className="loading-spinner">
          <Spinner />
        </div>
      );
    } else {
      if (posts.length > 0) {
        return posts.map((post) => {
          return (
            <PostParent
              key={post.contentID}
              datapost={{ post, user: thisUser, currentUser }}
            />
          );
        });
      } else {
        return <div className="empty-post">No posts yet.</div>;
      }
    }
  };

  return (
    <div className="profile-content">
      {currentUser.email === thisUser.email && (
        <StatusPost userProfile={thisUser} />
      )}
      <GetContent />
    </div>
  );
};

export default ProfileContent;
